<script>
import Node from './Node/Node'

export default {
  name: 'root',
  mixins: [Node]
}
</script>

<!--<style lang="scss" scoped>
.node {
    > .node-children {
        padding-left: 18px;
    }
    &.open {
        .node-children {
            display: none;
        }
    }
    &.selected {
        background-color: #D4E8FD;
        .node-children {
        border-left-color: transparent;
        }
    }
}
</style>
-->
