<template>
    <section class="node">
        <node-text :attributes="attributes"
                   :id="id"
                   :parentid="parentid"
                   :renderCollapseButton="hasOutline"
                   :renderExpandButton="hasOutline" />
        <node-note :attributes="attributes"
                   :id="id"
                   :parentid="parentid"/>
        <node-outline v-if="isExpand"
                      :outline="outline"
                      :id="id" />
    </section>
</template>

<script>
  import NodeNote from './NodeNote'
  import NodeText from './NodeText'
  import NodeOutline from './NodeOutline'

  export default {
    name: 'node',
    props: ['attributes', 'outline', 'id', 'parentid'],
    components: {
      NodeNote,
      NodeText,
      NodeOutline
    },
    computed: {
      // 判断有没有子节点
      hasOutline () {
        return (this.outline && Array.isArray(this.outline) &&
          this.outline.length > 0)
      },
      // node-outline 默认展开，如果要折叠就将 isExpand 设置为 false
      isExpand () {
        return this.attributes.isExpand !== false
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