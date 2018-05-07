<template>
    <div class="node-text"
         @mouseenter="handleMouseenter"
         @mouseleave="handleMouseLeave">
        <collapse-button v-if="renderCollapseButton"
                         v-show="showCollapseButton" />
        <expand-button v-if="renderExpandButton"
                       v-show="showExpandButton" />
        <bullet-button />
        <text-field :text="text"
                    @updateOutlineText="updateOutlineText" />
    </div>
</template>

<script>
  import _ from 'lodash'
  import CollapseButton from './CollapseButton'
  import ExpandButton from './ExpandButton'
  import BulletButton from './BulletButton'
  import TextField from './TextField'

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
      handleMouseLeave () {
        this.hideButton()
      },
      updateOutlineText (text) {
        const parentid = this.parentid
        const _id = this.data._id
        this.$store.dispatch('updateOutlineText', {
          parentid: parentid,
          _id: _id,
          text: text
        })
        this.$store.dispatch('addOutline', {
          parentid: parentid,
          previd: _id
        })
      }
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