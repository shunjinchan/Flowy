<template>
  <section class="node">
    <node-text :data="data"
               :parentid="parentid"
               :previd="previd"
               :index="index"
               :renderCollapseButton="hasChildren && isExpanded"
               :renderExpandButton="hasChildren && isCollapsed"
               :collapseChildren="collapseChildren"
               :expandChildren="expandChildren"
               :lazyUpdateOutline="lazyUpdateOutline" :updateOutline="updateOutline" 
               :currentOutlineid="currentOutlineid" />
    <node-note :data="data"
               :parentid="parentid" />
    <node-children v-if="hasChildren && isExpanded"
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
      require: true,
      default () {
        return {}
      }
    },
    parentid: {
      type: String,
      require: false
    },
    index: {
      type: Number
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
    outline () {
      return this.$store.state.Outline[this.parentid].outline
    },
    currentOutlineid () {
      return this.$store.state.Outline.currentOutlineid
    },
    currentIndex () {
      return this.outline.indexOf(this.data._id)
    },
    previd () {
      let previd = ''
      if (
        this.parentid &&
        this.data._id &&
        this.currentIndex >= 1
      ) {
        previd = this.outline[this.currentIndex - 1]
      }
      return previd
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
    lazyUpdateOutline (outlineData) {
      this.$store.dispatch('lazyUpdateOutline', outlineData)
    },
    collapseChildren () {
      const data = _.merge({}, this.data, {
        attributes: { isExpanded: false }
      })
      this.updateOutline(data)
    },
    expandChildren () {
      const data = _.merge({}, this.data, {
        attributes: { isExpanded: true }
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
