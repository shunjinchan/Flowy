<template>
  <section class="node" 
           :class="{ focus: isFocus }" 
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
import NodeNote from './NodeNote'
import NodeText from './NodeText'
import NodeChildren from './NodeChildren'

export default {
  name: 'node',

  data () {
    return {
      isFocus: false
    }
  },

  props: {
    nodeData: {
      type: Object,
      require: true,
      default () {
        return {}
      }
    },
    parentid: {
      type: String,
      require: false
    },
    index: {
      type: Number
    },
    grandparentid: {
      type: String
    }
  },

  components: {
    NodeNote,
    NodeText,
    NodeChildren
  },

  computed: {
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

    currentIndex () {
      return this.parentChildren.indexOf(this.nodeData._id)
    },

    _id () {
      return this.nodeData._id
    },

    previd () {
      let previd = ''
      if (
        this.parentid &&
        this.nodeData._id &&
        this.currentIndex >= 1
      ) {
        previd = this.parentChildren[this.currentIndex - 1]
      }
      return previd
    },

    nextid () {
      let nextid = ''
      if (
        this.parentid &&
        this.nodeData._id &&
        this.currentIndex < this.parentChildren.length - 1
      ) {
        nextid = this.parentChildren[this.currentIndex + 1]
      }
      return nextid
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
      if (this.lastEditNode === this.nodeData._id) return true
      return false
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

    // move line
    swapNodePosition (sourceid, targetid, parentid) {
      const parentNode = _.cloneDeep(this.$store.state.node[parentid])
      const sourceIndex = parentNode.children.indexOf(sourceid)
      const targetIndex = parentNode.children.indexOf(targetid)

      parentNode.children[targetIndex] = sourceid
      parentNode.children[sourceIndex] = targetid
      this.updateNode(parentNode)
    },

    handleMoveLineUp ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode || !this.previd) return

      this.updateNode(this.updateNodeText(evt.target.innerHTML))
      this.swapNodePosition(this._id, this.previd, this.parentid)
    },

    handleMoveLineDown ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode || !this.nextid) return

      this.updateNode(this.updateNodeText(evt.target.innerHTML))
      this.swapNodePosition(this._id, this.nextid, this.parentid)
    },

    bindEvents () {
      // 更换节点位置只支持同级节点，不能跨级更换
      this.$root.$on('command:moveLineUp', this.handleMoveLineUp)
      this.$root.$on('command:moveLineDown', this.handleMoveLineDown)
    },

    updateFocusStatus () {
      if (this._id === this.lastEditNode) {
        this.isFocus = true
      } else {
        this.isFocus = false
      }
    }
  },

  mounted () {
    this.bindEvents()
    this.updateFocusStatus()
  },

  updated () {
    this.updateFocusStatus()
  },

  beforeDestroy () {
    this.$root.$off('command:moveLineUp', this.handleMoveLineUp)
    this.$root.$off('command:moveLineDown', this.handleMoveLineDown)
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
}
</style>
