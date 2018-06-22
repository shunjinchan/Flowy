<script>
import _ from 'lodash'
import Node from './Node.vue'

export default {
  name: 'node-children',

  props: {
    nodeData: {
      type: Object // 父组件的 _id 将成为子组件的 parentid
    },
    parentid: {
      type: String // 父组件的 parentid 将成为子组件的 grandparentid
    }
  },

  computed: {
    children () {
      const children = _.get(this.nodeData, 'children')
      return children || []
    },
    hasChildren () {
      return this.children && this.children.length > 0
    }
  },

  components: {
    Node
  },

  render (h) {
    if (!this.hasChildren) return

    const ele = this.children.map((nodeid, index) => {
      const childNodeData = this.$store.getters.getNode(nodeid) || {}
      // Node 节点为什么不加 key={childNodeData._id}
      // 增加了 key 之后会复用节点，会导致组件的聚焦状态错误
      // 详见 https://cn.vuejs.org/v2/guide/list.html#key
      return (
        <Node
          nodeData={childNodeData}
        />
      )
    })

    return (
      <div class="node-children">
        { ele }
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.node-children {
  border-left: 1px solid #eee;
  margin-left: 9px;
}
</style>
