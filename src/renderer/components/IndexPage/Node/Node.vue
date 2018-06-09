<template>
  <section class="node" :data-id="nodeData._id" ref="node">
    <node-text :nodeData="nodeData"
               :parentid="parentid"
               :previd="previd"
               :index="index"
               :grandparentid="grandparentid"
               :isFocusTextField="isFocusTextField"
               :isCollapsed="isCollapsed"
               :renderCollapseButton="hasChildren && isExpanded"
               :renderExpandButton="hasChildren && isCollapsed"
               :collapseChildren="collapseChildren"
               :expandChildren="expandChildren"
               :lazyUpdateNode="lazyUpdateNode" 
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
      const affectedDocuments = await this.$store.dispatch(
        'updateNode', nodeData
      )
      return affectedDocuments
    },

    async lazyUpdateNode (nodeData) {
      const affectedDocuments = await this.$store.dispatch(
        'lazyUpdateNode', nodeData
      )
      return affectedDocuments
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

    bindEvents () {}
  },

  beforeDestroy () {
    console.log('before destory')
  }
}
</script>

<style lang="scss" scoped>
.node {
  > .node-children {
    padding-left: 18px;
  }
  &.open {
    .node-children {
        display: none;
    }
  }
}
</style>
