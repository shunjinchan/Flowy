<script>
  import _ from 'lodash'
  import Node from './Node'

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

      const parentid = this.nodeData._id
      const grandparentid = this.parentid
      const ele = this.children.map((nodeid, index) => {
        const childNodeData = this.$store.getters.getNode(nodeid) || {}
        return (
          <Node
            nodeData={childNodeData}
            index={index}
            parentid={parentid}
            grandparentid={grandparentid}
            key={childNodeData._id}
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

<style scoped>
  .node-children {
    border-left: 1px solid #eee;
    margin-left: 9px;
  }
</style>
