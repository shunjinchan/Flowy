<template>
  <div class="node-text"
       @mouseenter="handleMouseenter"
       @mouseleave="handleMouseleave">
    <collapse-button v-if="renderCollapseButton"
                     v-show="showCollapseButton" />
    <expand-button v-if="renderExpandButton"
                   v-show="showExpandButton" />
    <bullet-button/>
    <text-field :text="text"
                @updateOutlineText="updateOutlineText"
                @addOutline="addOutline"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  import TextField from './TextField'
  import ExpandButton from './ExpandButton'
  import BulletButton from './BulletButton'
  import CollapseButton from './CollapseButton'

  export default {
    name: 'note-text',

    data () {
      return {
        showCollapseButton: false,
        showExpandButton: false
      }
    },

    props: {
      data: {
        type: Object
      },
      parentid: {
        type: String
      },
      renderCollapseButton: {
        type: Boolean
      },
      renderExpandButton: {
        type: Boolean
      }
    },

    computed: {
      text () {
        return _.get(this.data, 'attributes.text')
      }
    },

    components: {
      CollapseButton,
      ExpandButton,
      BulletButton,
      TextField
    },

    methods: {
      showButton () {
        this.showCollapseButton = true
        this.showExpandButton = true
      },
      hideButton () {
        this.showCollapseButton = false
        this.showExpandButton = false
      },
      handleMouseenter () {
        this.showButton()
      },
      handleMouseleave () {
        this.hideButton()
      },
      updateOutlineText (text) {
        this.data.attributes.text = text
        const outlineData = this.data
        this.$store.dispatch('updateOutline', outlineData)
      },
      addOutline () {
        const parentid = this.parentid
        const _id = this.data._id
        this.$store.dispatch('addOutline', {
          parentid: parentid,
          previd: _id
        })
      },
      deleteOutline () {}
    }
  }
</script>

<style lang="scss" scoped>
  .node-text {
    display: flex;
    line-height: 20px;
    padding-top: 4px;
    .text-field {
      flex-grow: 1;
      outline: none;
    }
  }
</style>