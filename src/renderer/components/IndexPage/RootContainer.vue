<script>
import _ from 'lodash'
// import Rx from 'rxjs/Rx'
import Root from './Root'
// import { getAllNode, insertNode } from '../../services/node.services'

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
    async initRootNode () {
      const rootNode = await this.$store.dispatch('initRootNode')
      const allNode = await this.$store.dispatch('getAllNode')
      if (_.isEmpty(rootNode) || _.isEmpty(allNode)) return
      if (!this.rootData.children || this.rootData.children.length === 0) {
        await this.$store.dispatch('addNode', { parentid: 'root' })
      }
    },

    async initFakeRootNode (_id) {
      const allNode = await this.$store.dispatch('getAllNode')
      if (_.isEmpty(allNode)) return
      this.rootid = _id
    }

    // getRootNode () {
    //   const updateRootNodeState = (data) => {
    //     this.$store.commit('updateNode', data)
    //     debugger
    //     // if (!data.children || data.children.length === 0) {
    //     //   this.$store.dispatch('addNode', { parentid: data._id })
    //     // }
    //   }
    //   const initApp = () => {
    //     Rx.Observable.fromPromise(insertNode({
    //       _id: 'root',
    //       attributes: { text: 'Home', note: '' },
    //       children: []
    //     })).subscribe(root => {
    //       if (root && !_.isEmpty(root)) {
    //         updateRootNodeState(root)
    //       }
    //     })
    //   }

    //   Rx.Observable.fromPromise(getAllNode()).subscribe(nodeList => {
    //     if (!nodeList || _.isEmpty(nodeList)) {
    //       initApp()
    //     } else {
    //       nodeList.forEach(node => {
    //         if (node._id === this.rootid) {
    //           updateRootNodeState(node)
    //         }
    //       })
    //     }
    //   })
    // }
  },

  async mounted () {
    if (this.rootid === 'root') {
      await this.initRootNode()
    } else {
      await this.initFakeRootNode(this.rootid)
    }
  }
}
</script>
