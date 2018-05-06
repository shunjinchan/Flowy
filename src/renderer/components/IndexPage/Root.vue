<script>
  import Node from './Node/Node'

  export default {
    name: 'root',
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