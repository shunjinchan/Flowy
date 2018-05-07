<template>
    <article className="outline">
        <root :data="data"></root>
    </article>
</template>

<script>
  import { mapState } from 'vuex'
  import Root from './Root'

  export default {
    name: 'outline',
    components: {
      Root
    },
    computed: mapState({
      data: state => state.Outline.root
    }),
    mounted () {
      console.log(this.data)
      // this.$store.dispatch('getRootNode')
      // // 如果根节点没有子节点，为根节点新增一个子节点
      // if (this.outline && this.outline.length === 0) {
      //   const _id = this._id
      //   this.$store.dispatch('addOutline', {
      //     parentid: _id
      //   })
      // }
    }
  }
</script>

<style lang="scss"></style>