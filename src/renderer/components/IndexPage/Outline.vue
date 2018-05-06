<template>
    <article className="outline">
        <!--<node :attributes="attributes" :outline="outline" :id="id"></node>-->
        <root :attributes="attributes" :outline="outline" :id="id"></root>
    </article>
</template>

<script>
  import { mapState } from 'vuex'
  import Node from './Node/Node'
  import Root from './Root'

  export default {
    name: 'outline',
    components: {
      Node,
      Root
    },
    computed: mapState({
      attributes: state => state.Outline.root.attributes,
      outline: state => state.Outline.root.outline,
      id: state => state.Outline.root.id
    }),
    mounted () {
      if (this.outline.length === 0) {
        const id = this.id
        this.$store.commit('addOutline', {
          id: id
        })
      }
    }
  }
</script>

<style lang="scss"></style>