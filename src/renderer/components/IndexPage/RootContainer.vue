<script>
  import { mapGetters } from 'vuex'
  import Root from './Root'

  export default {
    name: 'root-container',

    components: {
      Root
    },

    computed: mapGetters({
      data: 'root'
    }),

    render (h) {
      return (
        <root data={this.data} />
      )
    },

    methods: {
      /**
       * 添加节点
       * @param params
       * @returns {Promise<void>}
       */
      async addOutline (params) {
        this.$store.dispatch('addOutline', params)
      }
    },

    async mounted () {
      await this.$store.dispatch('initRootOutline')
      await this.$store.dispatch('getAllOutline')
      if (!this.data.outline || this.data.outline.length === 0) {
        this.addOutline({
          parentid: 'root'
        })
      }
    }
  }
</script>

<style lang="scss"></style>