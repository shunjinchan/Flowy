<template>
  <section class="node" 
           :class="{ focus: isFocusTextField, selected: isSelected }" 
           :data-id="nodeData._id" 
           ref="node">
    <node-text :nodeData="nodeData"
               :index="index"
               :previd="previd"
               :nextid="nextid"
               :parentid="parentid"
               :grandparentid="grandparentid"
               :isFocusTextField="isFocusTextField"
               :isCollapsed="isCollapsed"
               :renderCollapseButton="hasChildren && isExpanded"
               :renderExpandButton="hasChildren && isCollapsed"
               :collapseChildren="collapseChildren"
               :expandChildren="expandChildren"
               :lazyUpdateNode="lazyUpdateNode" 
               :updateNodeText="updateNodeText" 
               :handleTextFocus="handleTextFocus"
               :handleTextBlur="handleTextBlur"
               :deleteNode="deleteNode" 
               :updateNode="updateNode" />

    <node-note :nodeData="nodeData"
               :parentid="parentid"
               :updateNode="updateNode" />

    <node-children v-if="hasChildren && isExpanded"
                   :nodeData="nodeData"
                   :parentid="parentid" />
  </section>
</template>

<script>
import _ from 'lodash'
import { logger } from '@/modules/logger'
import NodeNote from './NodeNote'
import NodeText from './NodeText'
import NodeChildren from './NodeChildren'

export default {
  name: 'node',

  data () {
    return {
      isFocus: false,
      isSelected: false
    }
  },

  props: {
    nodeData: {
      type: Object,
      require: true,
      default () {
        return {}
      }
    }
  },

  components: {
    NodeNote,
    NodeText,
    NodeChildren
  },

  computed: {
    _id () {
      return this.nodeData._id
    },

    previd () {
      let previd = ''
      if (
        this.parentid &&
        this.nodeData._id &&
        this.index >= 1
      ) {
        previd = this.parentChildren[this.index - 1]
      }
      return previd
    },

    nextid () {
      let nextid = ''
      if (
        this.parentid &&
        this.nodeData._id &&
        this.index < this.parentChildren.length - 1
      ) {
        nextid = this.parentChildren[this.index + 1]
      }
      return nextid
    },

    parentid () {
      return this.nodeData.parentid
    },

    grandparentid () {
      let grandparentid = ''
      if (this.parentid) {
        const parentNode = this.$store.getters.getNode(this.parentid)
        grandparentid = parentNode ? parentNode.parentid : ''
      }
      return grandparentid
    },

    children () {
      return _.get(this.nodeData, 'children') || []
    },

    // 父节点的子节点数组，主要用于计算当前节点索引值与查找相邻节点
    parentChildren () {
      if (this.parentid) {
        return this.$store.getters.getNode(this.parentid).children
      } else {
        return [this.nodeData._id]
      }
    },

    index () {
      return this.parentChildren.indexOf(this.nodeData._id)
    },

    hasChildren () {
      return this.children && this.children.length > 0
    },

    isLeaf () {
      return this.children && this.children.length === 0
    },

    // node-children 默认展开，如果要折叠就将 isExpanded 设置为 false
    isExpanded () {
      return _.get(this.nodeData, 'attributes.isExpanded') !== false
    },

    isCollapsed () {
      return !this.isExpanded
    },

    lastEditNode () {
      return this.$store.getters.lastEditNode
    },

    isFocusTextField () {
      // 当前节点 id 与最后编辑的节点 id相等且在非选择模式下，focus 状态才为 true
      if (this.lastEditNode === this.nodeData._id && !this.selectionMode) {
        return true
      }
      return false
    },

    selection () {
      return this.$store.state.selection.list
    },

    selectionDirection () {
      return this.$store.state.selection.direction
    },

    selectionMode () {
      return this.$store.getters.selectionMode
    }
  },

  watch: {
    selection () {
      if (this.selection.some(_id => this._id === _id)) {
        this.isSelected = true
      } else {
        this.isSelected = false
      }
    }
  },

  methods: {
    async updateNode (nodeData) {
      this.$store.commit('updateNode', nodeData)
      const affectedDocuments = await this.$store.dispatch(
        'updateNode', nodeData
      )
      return affectedDocuments
    },

    async lazyUpdateNode (nodeData) {
      const affectedDocuments = await this.$store.dispatch(
        'updateNode', nodeData
      )
      return affectedDocuments
    },

    async deleteNode (_id) {
      this.$store.commit('deleteNode', _id)
      const numRemoved = await this.$store.dispatch(
        'deleteNode', _id
      )
      return numRemoved
    },

    updateLastEditNode (_id) {
      this.$store.commit('updateLastEditNode', _id)
    },

    updateNodeText (text) {
      const data = _.merge({}, this.nodeData, {
        attributes: { text: text }
      })

      return data
    },

    collapseChildren () {
      const data = _.merge({}, this.nodeData, {
        attributes: { isExpanded: false }
      })
      this.updateNode(data)
    },

    expandChildren () {
      const data = _.merge({}, this.nodeData, {
        attributes: { isExpanded: true }
      })
      this.updateNode(data)
    },

    // text field
    handleTextFocus (evt) {
      this.$store.commit('updateLastEditNode', this._id)
      this.$store.commit('updateTextFieldFocusStatus', true)
    },

    handleTextBlur (evt) {
      // onblur 时不要更新节点数据，原因：组件销毁（如缩进操作）会更新一次节点数据，
      // 同时也会触发 onblur 事件，但是缩进过后其父节点已经被改变，而 onblur 事件处理函数无法得知该情况
      this.$store.commit('updateTextFieldFocusStatus', false)
    },

    // move node
    swapNodePosition (sourceid, targetid, parentid) {
      const parentNode = _.cloneDeep(this.$store.state.node[parentid])
      const sourceIndex = parentNode.children.indexOf(sourceid)
      const targetIndex = parentNode.children.indexOf(targetid)

      parentNode.children[targetIndex] = sourceid
      parentNode.children[sourceIndex] = targetid
      this.updateNode(parentNode)
    },

    handleMoveNodeUp ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode || !this.previd) return

      this.updateNode(this.updateNodeText(evt.target.innerHTML))
      this.swapNodePosition(this._id, this.previd, this.parentid)
    },

    handleMoveNodeDown ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode || !this.nextid) return

      this.updateNode(this.updateNodeText(evt.target.innerHTML))
      this.swapNodePosition(this._id, this.nextid, this.parentid)
    },

    // select node
    selectNode (_id) {
      this.$store.commit('addSelctionNode', _id)
    },

    unselectNode (_id) {
      this.$store.commit('removeSelectionNode', _id)
    },

    getParentNextNodeid (_id) {
      const node = this.$store.getters.getNode(_id)

      if (!node) return null
      // 如果没有父节点，直接定位到当前 id，正常情况下有且仅有 root 节点没有父节点
      if (!node.parentid) return _id

      const parentid = node.parentid
      const parentNode = this.$store.getters.getNode(parentid)

      if (
        parentNode &&
        parentNode.children &&
        parentNode.children.indexOf(_id) > -1
      ) {
        const children = parentNode.children
        const index = children.indexOf(_id)

        // 该节点为当前层级节点的最后一个节点，递归往上查找
        if (index >= children.length - 1) {
          return this.getParentNextNodeid(parentid)
        } else {
          return children[index + 1]
        }
      } else {
        logger.error({
          msg: `没有找到 _id 为 ${_id} 的父节点`
        })
        return null
      }
    },

    getPrevNodeid () {
      // 没有 parent id 说明已经到根节点了
      return this.previd || this.parentid || 'root'
    },

    getNextNodeid () {
      if (this.nextid) return this.nextid
      return this.getParentNextNodeid(this._id)
    },

    handleSelecePrevNode ({ evt, lastEditNode }) {
      // 输入模式下需要比对 id 是否一致
      if (this._id !== lastEditNode) return

      // 只剩下一个选择的节点之后，强行更正选择方向
      if (this.selection.length === 1) {
        this.$store.commit('updateSelectionDirection', 'up')
      }

      if (this.selectionDirection === '') {
        this.selectNode(this._id)
        this.updateLastEditNode(this._id)
        this.$store.commit('updateSelectionDirection', 'up')
        return
      }

      if (this.selectionDirection === 'up') {
        const prevNodeid = this.getPrevNodeid()
        this.selectNode(prevNodeid)
        this.updateLastEditNode(prevNodeid)
        return
      }

      if (this.selectionDirection === 'down') {
        this.unselectNode()
        console.log(this.$store.state.selection.poppedNodeid)
        this.updateLastEditNode(this.$store.state.selection.poppedNodeid)
      }
    },

    handleSeleceNextNode ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode) return

      // 只剩下一个选择的节点之后，强行更正选择方向
      if (this.selection.length === 1) {
        this.$store.commit('updateSelectionDirection', 'down')
      }

      if (this.selectionDirection === '') {
        this.selectNode(this._id)
        this.updateLastEditNode(this._id)
        this.$store.commit('updateSelectionDirection', 'down')
        return
      }

      if (this.selectionDirection === 'down') {
        const nextNodeid = this.getNextNodeid()
        this.selectNode(nextNodeid)
        this.updateLastEditNode(nextNodeid)
        // return
      }

      // if (this.selectionDirection === 'up') {
      //   console.log(this.$store.state.selection)
      //   this.unselectNode()
      //   this.updateLastEditNode(this.$store.state.selection.poppedNodeid)
      // }
    },

    bindEvents () {
      // TODO: 更换节点位置支持跨层级
      this.$root.$on('command:moveNodeUp', this.handleMoveNodeUp)
      this.$root.$on('command:moveNodeDown', this.handleMoveNodeDown)
      this.$root.$on('command:selectPrevNode', this.handleSelecePrevNode)
      this.$root.$on('command:selectNextNode', this.handleSeleceNextNode)
    }
  },

  mounted () {
    this.bindEvents()
  },

  beforeDestroy () {
    this.$root.$off('command:moveNodeUp', this.handleMoveNodeUp)
    this.$root.$off('command:moveNodeDown', this.handleMoveNodeDown)
    this.$root.$off('command:selectPrevNode', this.handleSelecePrevNode)
    this.$root.$off('command:selectNextNode', this.handleSeleceNextNode)
  }
}
</script>

<style lang="scss" scoped>
.node {
  position: relative;
  > .node-children {
    padding-left: 18px;
  }
  &.open {
    .node-children {
        display: none;
    }
  }
  &.focus {
    > .node-text {
      &::before {
        content: '';
        background-color: #eee;
        height: 100%;
        left: -5px;
        padding: 2px 5px 1px;
        position: absolute;
        top: 0;
        width: 100%;
        border-radius: 5px;
        z-index: -1;
      }
    }
  }
  &.selected {
    background-color: #D4E8FD;
    .node-children {
      border-left-color: transparent;
    }
  }
}
</style>
