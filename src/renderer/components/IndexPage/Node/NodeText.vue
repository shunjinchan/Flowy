<template>
  <div class="node-text"
       @mouseenter="handleMouseenter"
       @mouseleave="handleMouseleave">
    <collapse-button v-if="renderCollapseButton"
                     v-show="showCollapseButton"
                     :handleClick="collapseChildren" />
    <expand-button v-if="renderExpandButton"
                   v-show="showExpandButton"
                   :handleClick="expandChildren" />
    <bullet-button/>
    <text-field :text="text"
                :editable="editable"
                :handleKeypressEnter="handleKeypressEnter"
                :handleKeyupDelete="handleKeyupDelete"
                :handleClick="handleTextClick"
                :handleInput="handleTextInput" />
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
        showExpandButton: false,
        editable: false
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
      },
      collapseChildren: {
        type: Function
      },
      expandChildren: {
        type: Function
      },
      updateOutline: {
        type: Function,
        default () {
          return () => {}
        },
        require: false
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
      deleteOutline () {
        const parentid = this.parentid
        const _id = this.data._id
        const param = {
          parentid: parentid,
          _id: _id
        }
        this.$store.dispatch('deleteOutline', param)
      },
      // text-field
      enableEditable () {
        this.editable = true
      },
      disableEditable () {
        this.editable = false
      },
      updateOutlineText (text) {
        const data = _.merge({}, this.data, {
          attributes: {
            text: text
          }
        })
        return data
      },
      addOutline () {
        const parentid = this.parentid
        const _id = this.data._id
        const param = {
          parentid: parentid,
          previd: _id
        }
        this.$store.dispatch('addOutline', param)
      },
      handleKeypressEnter (evt) {
        this.disableEditable()
        this.updateOutline(this.updateOutlineText(evt.target.textContent))
        this.addOutline()
      },
      handleTextClick () {
        this.enableEditable()
      },
      handleTextInput (evt) {
        this.updateOutline(this.updateOutlineText(evt.target.textContent))
      },
      handleKeyupDelete (evt) {
        if (evt.target.textContent === '') {
          this.updateOutlineText(evt.target.textContent)
          this.deleteOutline()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .node-text {
    display: flex;
    line-height: 20px;
    padding-top: 4px;
    position: relative;
    .text-field {
      flex-grow: 1;
      outline: none;
    }
    .collapse-button, .expand-button {
      position: absolute;
      left: -20px;
    }
  }
</style>
