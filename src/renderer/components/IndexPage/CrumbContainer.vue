<template>
  <crumb :crumbList="crumbList" />
</template>

<script>
import Crumb from './Crumb'
export default {
  name: 'crumb-container',
  components: {
    Crumb
  },
  computed: {
    crumb () {
      return this.$store.state.Crumb || { current: 'root' }
    },
    crumbList () {
      const list = []
      const getCrumbList = (_id) => {
        const outline = this.$store.getters.getOutline(_id)
        list.unshift(outline)
        if (outline && outline.parentid) getCrumbList(outline.parentid)
      }
      getCrumbList(this.crumb.current)
      return list
    }
  }
}
</script>
