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
      data () {
        return this.$store.state.Outline[this.rootid] || {}
      }
    },

    render (h) {
      return (
        <root data={this.data} />
      )
    },

    watch: {
      '$route' (to, from) {
        this.rootid = to.params.id || 'root'
      }
    },

    methods: {
      /**
       * 添加节点
       * @param params
       * @returns {Promise<void>}
       */
      async addOutline (params) {
        this.$store.dispatch('addOutline', params)
      },

      async initRootOutline () {
        await this.$store.dispatch('initRootOutline')
        await this.$store.dispatch('getAllOutline')
        if (!this.data.outline || this.data.outline.length === 0) {
          this.addOutline({
            parentid: 'root'
          })
        }
      },

      async initFakeRootOutline (_id) {
        await this.$store.dispatch('getAllOutline')
        this.rootid = _id
      }
    },

    mounted () {
      if (this.rootid === 'root') {
        this.initRootOutline()
      } else {
        this.initFakeRootOutline(this.rootid)
      }
    }
  }
</script>
