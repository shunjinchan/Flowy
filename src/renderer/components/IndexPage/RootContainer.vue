<script>
import Root from './Root'

export default {
  name: 'root-container',

  components: {
    Root
  },

  data () {
    return {
      rootid: this.$route.params.id || 'root'
    }
  },

  computed: {
    rootData () {
      return this.$store.getters.getNode(this.rootid) || {}
    }
  },

  render (h) {
    return (
      <root nodeData={this.rootData} key={this.rootData._id} />
    )
  },

  watch: {
    '$route' (to, from) {
      this.rootid = to.params.id || 'root'
    }
  },

  methods: {
    async getRootNode () {
      const _id = this.rootid
      await this.$store.dispatch('getRootNode', { _id })
    }
  },

  mounted () {
    console.log('root container')
    this.getRootNode()
  }
}
</script>
