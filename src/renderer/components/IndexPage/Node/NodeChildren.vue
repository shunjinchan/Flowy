<script>
  import _ from 'lodash'
  import Node from './Node'

  export default {
    name: 'node-children',

    props: {
      data: {
        type: Object // 父组件的 _id 将成为子组件的 parentid
      },
      parentid: {
        type: String
      }
    },

    computed: {
      children () {
        const outline = _.get(this.data, 'outline')
        return outline || []
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

      const ele = this.children.map((item, index) => {
        const data = this.$store.getters.getOutline(item) || {}
        return (
          <Node data={data} index={index} parentid={this.data._id} grandparentid={this.parentid} key={data._id} />
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
