<script>
  import _ from 'lodash'
  import Node from './Node'

  export default {
    name: 'node-outline',
    props: {
      data: {
        type: Object // 父组件的 _id 将成为子组件的 parentid
      }
    },
    computed: {
      outline () {
        return _.get(this.data, 'outline') ? _.get(this.data, 'outline') : []
      },
      hasOutline () {
        return this.outline && this.outline.length > 0
      }
    },
    components: {
      Node
    },
    render (h) {
      if (!this.hasOutline) return

      const ele = this.outline.map((_id) => {
        const item = this.getOutline(_id)
        console.log(item)
        return (
          <Node
            data={item}
            parentid={this.data._id}/>
        )
      })

      return (
        <div class="node-outline">
          {ele}
        </div>
      )
    },
    methods: {
      getOutline (_id) {
        return this.$store.state.Outline[_id]
      }
    }
  }
</script>

<style scoped>
    .node-outline {
        border-left: 1px solid #eee;
        margin-left: 9px;
    }
</style>