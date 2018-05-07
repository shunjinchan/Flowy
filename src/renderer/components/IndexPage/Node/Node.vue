<template>
    <section class="node">
        <node-text :data="data"
                   :parentid="parentid"
                   :renderCollapseButton="hasOutline"
                   :renderExpandButton="hasOutline" />
        <node-note :data="data"
                   :parentid="parentid"/>
        <node-outline v-if="hasOutline && isExpand"
                      :data="data" />
    </section>
</template>

<script>
  import _ from 'lodash'
  import NodeNote from './NodeNote'
  import NodeText from './NodeText'
  import NodeOutline from './NodeOutline'

  export default {
    name: 'node',
    props: ['data', 'parentid'],
    components: {
      NodeNote,
      NodeText,
      NodeOutline
    },
    computed: {
      // 判断有没有子节点
      hasOutline () {
        return _.get(this.data, 'outline').length > 0
      },
      // node-outline 默认展开，如果要折叠就将 isExpand 设置为 false
      isExpand () {
        return _.get(this.data, 'attributes.isExpand') !== false
      }
    }
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