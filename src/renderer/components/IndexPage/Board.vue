<script>
import CrumbContainer from './CrumbContainer'
import RootContainer from './RootContainer'

export default {
  name: 'board',

  components: {
    RootContainer,
    CrumbContainer
  },

  render (h) {
    return (
      <main class="board">
        <crumb-container />
        <article className="article">
          <root-container />
        </article>
      </main>
    )
  },

  methods: {
    bindEvents () {
      document.addEventListener('click', (e) => {
        this.$store.commit('clearSelectionNode')
      })
    }
  },

  mounted () {
    this.bindEvents()
  }
}
</script>

<style lang="scss" scoped>
  .board {
    position: relative;
    background: #fff;
    opacity: 1;
    padding: 30px 60px 10px;
    z-index: 1;
    /*border: 1px solid #d6d6d6;*/
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: transform .2s;
    font-family: 'Helvetica Neue',Arial,Sans-serif;
    font-size: 16px;
    font-weight: normal;
  }
</style>
