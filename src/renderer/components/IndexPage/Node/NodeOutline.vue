<script>
  import Node from './Node'

  export default {
    name: 'node-outline',
    props: {
      outline: {
        type: Array,
        default () {
          return []
        }
      },
      id: {
        type: String // 父组件的 id 将成为子组件的 parentid
      }
    },
    components: {
      Node
    },
    render (h) {
      if (!this.hasOutline) return

      const ele = this.outline.map((id) => {
        const item = this.getOutline(id)
        console.log(item)
        return (
          <Node
            attributes={item.attributes}
            id={item.id}
            parentid={this.id}
            outline={item.outline} />
        )
      })

      return (
        <div class="node-outline">
          {ele}
        </div>
      )
    },
    computed: {
      hasOutline () {
        return this.outline.length > 0
      }
    },
    methods: {
      getOutline (id) {
        return this.$store.state.Outline[id]
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