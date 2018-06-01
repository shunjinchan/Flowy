<template>
  <div class="node-text">
    <collapse-button v-if="renderCollapseButton"
                     :handleClick="collapseChildren" />
    <expand-button v-if="renderExpandButton"
                   :handleClick="expandChildren" />
    <bullet-button :isCollapsed="isCollapsed"
                   :handleClick="handleBulletClick" />
    <text-field :text="text"
                :isFocus="isFocus"
                :handleClick="handleTextClick"
                :handleFocus="handleTextFocus"
                :handleBlur="handleTextBlur"
                :handleInput="handleTextInput"
                :handleKeydownTab="handleKeydownTab"
                :handleKeydownEnter="handleKeydownEnter"
                :handleKeydownDelete="handleKeydownDelete"
                :handleKeydownShiftAndTab="handleKeydownShiftAndTab"
                :handleKeydownShiftAndEnter="handleKeydownShiftAndEnter" />
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
    expandChildren: {
      type: Function
    },
    lazyupdateNode: {
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
    lastEditNode () {
      return this.$store.getters.lastEditNode || {}
    },
    text () {
      // 响应式：更新会将输入框的聚焦状态置换到首字符之前
      // 不是响应式：无法响应更新，例如路由跳转后
      return _.get(this.nodeData, 'attributes.text') || ''
    },
    isFocus () {
      if (this.lastEditNode.nodeid === this._id) return true
      return false
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

    async deleteNodeChildren (_id, parentid) {
      const parentNodeData = await this.$store.dispatch(
        'deleteNodeChildren',
        { _id, parentid }
      )
      return parentNodeData
    },

    // 将节点设置为其目标节点的子节点
    async moveNodeToTargetNode (_id, targetid) {
      const targetNodeData = await this.$store.dispatch(
        'addNodeChildren',
        { _id, targetid }
      )
      return targetNodeData
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

    async indentRight (text) {
      const previd = this.previd
      const _id = this._id
      const parentid = this.parentid
      // 由于在输入的时候文本框的内容是非响应式的，缩进的操作是重新实例化一个节点组件，所以需要先更新数据再缩进
      // 更新当前节点
      await this.updateNode(_.merge({}, this.nodeData, {
        parentid: previd,
        attributes: { text: text }
      }))
      // 将该节点从父节点的子节点数组中移除
      await this.deleteNodeChildren(_id, parentid)
      // 将该节点添加到前一个节点的子节点数组中
      await this.moveNodeToTargetNode(_id, previd)
    },

    async indentLeft (text) {
      const grandparentid = this.grandparentid
      const _id = this._id
      const parentid = this.parentid
      // 更新当前节点
      await this.updateNode(_.merge({}, this.nodeData, {
        parentid: grandparentid,
        attributes: { text: text }
      }))
      // 将该节点从父节点的子节点数组中移除
      await this.deleteNodeChildren(_id, parentid)
      // 将该节点添加到其祖父节点的子节点数组中
      await this.moveNodeToTargetNode(_id, grandparentid)
    },

    handleTextClick (evt) {},

    handleTextFocus (evt) {
      this.$store.dispatch('updateLastEditNode', this._id)
    },

    handleTextBlur (evt) {
      this.updateNode(this.updateNodeText(evt.target.textContent))
    },

    handleTextInput (text) {
      this.lazyupdateNode(this.updateNodeText(text))
    },

    handleKeydownEnter (text) {
      debugger
      const parentid = this.parentid
      const _id = this._id
      // 更新该节点，并为父节点添加一个新的子节点
      const addNode = async () => {
        const newNode = await this.addNode({ parentid: parentid, previd: _id })
        this.$store.dispatch('updateLastEditNode', newNode._id)
      }

      if (text === '') {
        // 当前节点的父节点是根节点且没有输入内容，不执行任何操作
        if (parentid === 'root' || parentid === this.$route.params.id) {
          return
        }
        this.indentLeft(text)
      } else {
        addNode()
      }
    },

    handleKeydownDelete (evt) {
      const previd = this.previd

      if (evt.target.textContent === '') {
        this.deleteCurrentNode()
        if (previd) {
          this.$store.dispatch('updateLastEditNode', previd)
        }
      }
    },

    handleKeydownTab (evt) {
      if (this.index < 1) return

      this.indentRight(evt.target.textContent)
    },

    handleKeydownShiftAndTab (evt) {
      this.indentLeft(evt.target.textContent)
    },

    handleKeydownShiftAndEnter (evt) {
      debugger
    }
  }
}
</script>

<style lang="scss" scoped>
.node-text {
  display: flex;
  line-height: 20px;
  padding-top: 4px;
  position: relative;
  .text-field {
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
}
</style>
