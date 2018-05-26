<script>
import _ from 'lodash'
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
    data () {
      return this.$store.getters.getOutline(this.rootid) || {}
    }
  },

  render (h) {
    return (
      <root data={this.data} key={this.data._id} />
    )
  },

  watch: {
    '$route' (to, from) {
      this.rootid = to.params.id || 'root'
    }
  },

  methods: {
    async initRootOutline () {
      const rootOutline = await this.$store.dispatch('initRootOutline')
      const allOutline = await this.$store.dispatch('getAllOutline')
      if (_.isEmpty(rootOutline) || _.isEmpty(allOutline)) return
      if (!this.data.outline || this.data.outline.length === 0) {
        await this.$store.dispatch('addOutline', { parentid: 'root' })
      }
    },

    async initFakeRootOutline (_id) {
      const allOutline = await this.$store.dispatch('getAllOutline')
      if (_.isEmpty(allOutline)) return
      this.rootid = _id
    }
  },

  async mounted () {
    if (this.rootid === 'root') {
      await this.initRootOutline()
    } else {
      await this.initFakeRootOutline(this.rootid)
    }
  }
}
</script>
