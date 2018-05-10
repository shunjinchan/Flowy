<script>
  import Node from './Node'

  export default {
    name: 'child-node',
    mixins: [Node]
  }
</script>

<style lang="scss" scoped>
  .node {
    > .node-outline {
      padding-left: 18px;
    }
    &.open {
      .node-outline {
        display: none;
      }
    }
  }
</style>