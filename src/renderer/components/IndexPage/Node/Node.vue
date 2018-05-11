<template>
  <section class="node">
    <node-text :data="data"
               :parentid="parentid"
               :renderCollapseButton="hasOutline && isExpanded"
               :renderExpandButton="hasOutline && isCollapsed" />
    <node-note :data="data"
               :parentid="parentid"/>
    <node-outline v-if="hasOutline && isExpanded" e
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

    props: {
      data: {
        type: Object,
        require: true
      },
      parentid: {
        type: String,
        require: false
      }
    },

    components: {
      NodeNote,
      NodeText,
      NodeOutline
    },

    computed: {
      outline () {
        return _.get(this.data, 'outline') || []
      },
      // 判断有没有子节点
      hasOutline () {
        return this.outline.length > 0
      },
      // node-outline 默认展开，如果要折叠就将 isExpanded 设置为 false
      isExpanded () {
        return _.get(this.data, 'attributes.isExpanded') !== false
      },
      isCollapsed () {
        return !this.isExpanded
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