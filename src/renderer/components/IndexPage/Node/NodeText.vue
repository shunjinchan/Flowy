<template>
  <div class="node-text">
    <collapse-button v-if="renderCollapseButton"
                     :handleClick="collapseChildren" />
    <expand-button v-if="renderExpandButton"
                   :handleClick="expandChildren" />
    <bullet-button :isCollapsed="isCollapsed"
                   :handleClick="handleBulletClick" />
    <text-field :text="text"
                :isFocus="isFocusTextField"
                :handleClick="handleTextClick"
                :handleFocus="handleTextFocus"
                :handleBlur="handleTextBlur"
                :handleKeydownEnter="handleKeydownEnter"
                :handleKeydownDelete="handleKeydownDelete"
                :handleInput="handleTextInput" />
    <!-- <div>
      <span>id: {{ _id }}</span>
      <span>nextid: {{ nextid }}</span>
    </div> -->
  </div>
</template>

<script>
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import TextField from './TextField'
import ExpandButton from './ExpandButton'
import BulletButton from './BulletButton'
import CollapseButton from './CollapseButton'

export default {
  name: 'note-text',

  data () {
    return {
      showCollapseButton: false,
      showExpandButton: false
    }
  },

  props: {
    nodeData: {
      type: Object,
      default () {
        return {}
      }
    },
    parentid: {
      type: String
    },
    previd: {
      type: String
    },
    nextid: {
      type: String
    },
    grandparentid: {
      type: String
    },
    index: {
      type: Number
    },
    renderCollapseButton: {
      type: Boolean
    },
    renderExpandButton: {
      type: Boolean
    },
    collapseChildren: {
      type: Function
    },
    isCollapsed: {
      type: Boolean
    },
    isFocusTextField: {
      type: Boolean
    },
    expandChildren: {
      type: Function
    },
    lazyUpdateNode: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    updateNode: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    }
  },

  computed: {
    _id () {
      return this.nodeData._id
    },
    text () {
      // 响应式：更新会将输入框的聚焦状态置换到首字符之前
      // 不是响应式：无法响应更新，例如路由跳转后
      return _.get(this.nodeData, 'attributes.text') || ''
    }
  },

  components: {
    CollapseButton,
    ExpandButton,
    BulletButton,
    TextField
  },

  methods: {
    // bullet-button
    handleBulletClick () {
      this.$router.push({ path: this._id })
      this.$store.dispatch('updateCrumb', this._id)
    },

    // text-field
    addNodeToTargetNode (_id, targetid, previd) {
      const targetNode = _.cloneDeep(this.$store.state.node[targetid])

      // 有前一个相邻节点
      if (previd) {
        let index = targetNode.children.indexOf(previd)
        targetNode.children.splice(index + 1, 0, _id)
      } else {
        targetNode.children.push(_id)
      }

      this.updateNode(targetNode)
    },

    addNode (previd) {
      const _id = uuidv4()
      const newNode = {
        attributes: { text: '', note: '' },
        children: [],
        parentid: previd,
        _id: _id
      }

      this.$store.commit('addNode', newNode)
      this.$store.dispatch('addNode', newNode)

      return newNode
    },

    deleteNode (_id) {
      this.$store.dispatch('deleteNode', _id)
    },

    deleteNodeFromSourceNode (_id, sourceid) {
      const sourceNode = _.cloneDeep(this.$store.state.node[sourceid])
      const index = sourceNode.children.indexOf(_id)

      sourceNode.children.splice(index, 1)
      this.updateNode(sourceNode)
    },

    moveNodeToTargetNode (_id, targetid, previd) {
      const targetNode = _.cloneDeep(this.$store.state.node[targetid])

      if (previd) {
        let index = targetNode.children.indexOf(previd)
        targetNode.children.splice(index + 1, 0, _id)
      } else {
        targetNode.children.push(_id)
      }

      this.updateNode(targetNode)
    },

    updateNodeText (text) {
      const data = _.merge({}, this.nodeData, {
        attributes: { text: text }
      })

      return data
    },

    indentRight (text) {
      const previd = this.previd
      const _id = this._id
      const parentid = this.parentid

      this.deleteNodeFromSourceNode(_id, parentid)
      this.moveNodeToTargetNode(_id, previd)
      this.updateNode(_.merge({}, this.nodeData, {
        parentid: previd,
        attributes: { text: text }
      }))
    },

    indentLeft (text) {
      const grandparentid = this.grandparentid
      const _id = this._id
      const parentid = this.parentid

      this.deleteNodeFromSourceNode(_id, parentid)
      this.moveNodeToTargetNode(_id, grandparentid, parentid)
      this.updateNode(_.merge({}, this.nodeData, {
        parentid: grandparentid,
        attributes: { text: text }
      }))
    },

    swapNodePosition (sourceid, targetid, parentid) {
      const parentNode = _.cloneDeep(this.$store.state.node[parentid])
      const sourceIndex = parentNode.children.indexOf(sourceid)
      const targetIndex = parentNode.children.indexOf(targetid)

      parentNode.children[targetIndex] = sourceid
      parentNode.children[sourceIndex] = targetid
      this.updateNode(parentNode)
      // this.$store.commit('updateLastEditNode', this.sourceid)
    },

    handleTextClick (evt) {},

    handleTextFocus (evt) {
      this.$store.commit('updateLastEditNode', this._id)
      this.$store.commit('updateTextFieldFocusStatus', true)
    },

    handleTextBlur (evt) {
      this.updateNode(this.updateNodeText(evt.target.textContent))
      this.$store.commit('updateTextFieldFocusStatus', false)
    },

    handleTextInput (text) {
      this.lazyUpdateNode(this.updateNodeText(text))
    },

    handleKeydownEnter (evt) {
      const parentid = this.parentid
      const _id = this._id
      const text = evt.target.textContent

      evt.preventDefault()
      if (text !== '') {
        const newNode = this.addNode(_id)
        this.addNodeToTargetNode(newNode._id, parentid, _id)
        this.$store.commit('updateLastEditNode', newNode._id)
      }
    },

    handleKeydownDelete (evt) {
      const previd = this.previd
      const text = evt.target.textContent

      if (text === '') {
        evt.preventDefault()
        //  最后一个根节点的子节点不需要删除
        if (this.parentid === 'root' && this.index === 0) return
        this.deleteNodeFromSourceNode(this._id, this.parentid)
        if (previd) {
          this.$store.commit('updateLastEditNode', previd)
        }
      }
    },

    handleIndentRight ({evt, lastEditNode}) {
      // 第一个子节点不需要右缩进
      if (this.index < 1) return
      if (this._id === lastEditNode) this.indentRight(evt.target.textContent)
    },

    handleIndentLeft ({evt, lastEditNode}) {
      // 父节点是根节点，不需要左缩进
      if (this.parentid === 'root') return
      if (this._id === lastEditNode) this.indentLeft(evt.target.textContent)
    },

    handleKeydownShiftAndEnter (evt) {
      debugger
    },

    // TODO: 跨层级聚焦
    handleFocusPrevNode ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode) return

      const previd = this.previd
      const parentid = this.parentid

      if (previd) {
        const prevNodeChildren = this.$store.getters.getNode(previd).children

        // 去过前一个节点有子节点，那么聚焦到其最后一个子节点处
        if (prevNodeChildren.length > 0) {
          this.$store.commit(
            'updateLastEditNode',
            prevNodeChildren[prevNodeChildren.length - 1]
          )
        } else {
          this.$store.commit('updateLastEditNode', previd)
        }

        return
      }

      if (parentid) {
        this.$store.commit('updateLastEditNode', parentid)
      }
    },

    handleFocusNextNode ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode) return

      const nextid = this.nextid
      const _id = this._id
      const currentNodeChildren = this.$store.getters.getNode(_id).children

      // 去过后一个节点有子节点，那么聚焦到其第一个子节点处
      if (currentNodeChildren.length > 0) {
        this.$store.commit('updateLastEditNode', currentNodeChildren[0])
        return
      }

      if (nextid) {
        this.$store.commit('updateLastEditNode', nextid)
      }
    },

    // TODO: 节点更换位置后无法保持聚焦状态
    handleMoveLineUp ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode || !this.previd) return

      this.swapNodePosition(this._id, this.previd, this.parentid)
    },

    // TODO: 节点更换位置后无法保持聚焦状态
    handleMoveLineDown ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode || !this.nextid) return

      this.swapNodePosition(this._id, this.nextid, this.parentid)
    },

    bindEvents () {
      this.$root.$on('command:indentRight', this.handleIndentRight)
      this.$root.$on('command:indentLeft', this.handleIndentLeft)
      this.$root.$on('command:focusPrevNode', this.handleFocusPrevNode)
      this.$root.$on('command:focusNextNode', this.handleFocusNextNode)
      this.$root.$on('command:moveLineUp', this.handleMoveLineUp)
      this.$root.$on('command:moveLineDown', this.handleMoveLineDown)
    }
  },

  mounted () {
    this.bindEvents()
  },

  beforeDestroy () {
    this.$root.$off('command:indentRight', this.handleIndentRight)
    this.$root.$off('command:indentLeft', this.handleIndentLeft)
  }
}
</script>

<style lang="scss" scoped>
.node-text {
  display: flex;
  line-height: 20px;
  padding-top: 4px;
  position: relative;
  .simple-text {
    flex-grow: 1;
  }
  .collapse-button, .expand-button {
    position: absolute;
    left: -20px;
    opacity: 0;
  }
  &:hover {
    .collapse-button, .expand-button {
      opacity: 1;
    }
  }
  span {
    background-color: #abcdef;
    margin-left: 10px;
    font-size: 12px;
  }
}
</style>
