<template>
  <section class="node">
    <node-text :data="data"
               :parentid="parentid"
               :renderCollapseButton="hasChildren && isExpanded"
               :renderExpandButton="hasChildren && isCollapsed"
               :collapseChildren="collapseChildren"
               :expandChildren="expandChildren"
               :updateOutline="updateOutline"/>
    <node-note :data="data"
               :parentid="parentid"/>
    <node-children v-if="hasChildren && isExpanded" e
                   :data="data" />
  </section>
</template>

<script>
  import _ from 'lodash'
  import NodeNote from './NodeNote'
  import NodeText from './NodeText'
  import NodeChildren from './NodeChildren'

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
      NodeChildren
    },

    computed: {
      children () {
        return _.get(this.data, 'outline') || []
      },
      hasChildren () {
        return this.children.length > 0
      },
      // node-children 默认展开，如果要折叠就将 isExpanded 设置为 false
      isExpanded () {
        return _.get(this.data, 'attributes.isExpanded') !== false
      },
      isCollapsed () {
        return !this.isExpanded
      }
    },

    methods: {
      updateOutline (outlineData) {
        this.$store.dispatch('updateOutline', outlineData)
      },
      collapseChildren () {
        const data = _.merge({}, this.data, {
          attributes: {
            isExpanded: false
          }
        })
        this.updateOutline(data)
      },
      expandChildren () {
        const data = _.merge({}, this.data, {
          attributes: {
            isExpanded: true
          }
        })
        this.updateOutline(data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .node {
    > .node-children {
      padding-left: 18px;
    }
    &.open {
      .node-children {
          display: none;
      }
    }
  }
</style>
