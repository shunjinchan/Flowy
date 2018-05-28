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
        const node = this.$store.getters.getNode(_id)
        list.unshift(node)
        if (node && node.parentid) getCrumbList(node.parentid)
      }
      getCrumbList(this.crumb.current) // 拼接节点数据
      list.pop() // 最后一个节点不需要在面包屑上展示
      return list
    }
  }
}
</script>
