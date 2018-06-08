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
    <div>
      <span>id: {{ _id }}</span>
      <span>parentid: {{ parentid }}</span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
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
    async addNode (param) {
      const newNodeData = await this.$store.dispatch('addNode', param)
      return newNodeData
    },

    async deleteNode (param) {
      const numRemoved = await this.$store.dispatch('deleteNode', param)
      return numRemoved
    },

    deleteNodeFromSourceNode (_id, sourceid) {
      const sourceNode = _.cloneDeep(this.$store.state.node[sourceid])
      const index = sourceNode.children.indexOf(_id)

      sourceNode.children.splice(index, 1)
      this.$store.commit('updateNode', sourceNode)
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

      this.$store.commit('updateNode', targetNode)
      this.updateNode(targetNode)
    },

    // bullet-button
    handleBulletClick () {
      this.$router.push({ path: this._id })
      this.$store.dispatch('updateCrumb', this._id)
    },

    // text-field
    deleteCurrentNode () {
      const parentid = this.parentid
      const _id = this._id
      const param = { parentid: parentid, _id: _id }
      this.deleteNode(param)
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

    async handleKeydownEnter (evt) {
      const parentid = this.parentid
      const _id = this._id
      const text = evt.target.textContent

      evt.preventDefault()
      await this.updateNode(this.updateNodeText(text))
      if (text !== '') {
        const newNode = await this.addNode({ parentid: parentid, previd: _id })
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
        this.deleteCurrentNode()
        previd && this.$store.commit('updateLastEditNode', previd)
      }
    },

    handleKeydownTab ({evt, lastEditNode}) {
      // 第一个子节点不需要右缩进
      if (this.index < 1) return
      if (this._id === lastEditNode) this.indentRight(evt.target.textContent)
    },

    handleKeydownShiftAndTab ({evt, lastEditNode}) {
      // 父节点是根节点，不需要左缩进
      if (this.parentid === 'root') return
      if (this._id === lastEditNode) this.indentLeft(evt.target.textContent)
    },

    handleKeydownShiftAndEnter (evt) {
      debugger
    },

    bindEvents () {
      this.$root.$on('command:indentRight', this.handleKeydownTab)
      this.$root.$on('command:indentLeft', this.handleKeydownShiftAndTab)
    }
  },

  mounted () {
    this.bindEvents()
  },

  beforeDestroy () {
    this.$root.$off('command:indentRight', this.handleKeydownTab)
    this.$root.$off('command:indentLeft', this.handleKeydownShiftAndTab)
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
