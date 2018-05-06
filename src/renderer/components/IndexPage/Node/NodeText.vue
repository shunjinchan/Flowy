<template>
    <div class="node-text"
         @mouseenter="handleMouseenter"
         @mouseleave="handleMouseLeave">
        <collapse-button v-if="renderCollapseButton"
                         v-show="showCollapseButton" />
        <expand-button v-if="renderExpandButton"
                       v-show="showExpandButton" />
        <bullet-button />
        <text-field :text="attributes.text"
                    @updateOutlineText="updateOutlineText" />
    </div>
</template>

<script>
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
      attributes: {
        type: Object
      },
      id: {
        type: String
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
        const id = this.id
        // 更新节点
        this.$store.commit('updateOutlineText', {
          parentid: parentid,
          id: id,
          text: text
        })
        // 新增一个节点
        this.$store.commit('addOutline', {
          id: parentid
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