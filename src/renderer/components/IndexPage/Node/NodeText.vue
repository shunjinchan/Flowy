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
                :handleKeydownTab="handleKeydownTab"
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
        editable: false,
        text: _.get(this.data, 'attributes.text') || '',
        _id: this.data._id
      }
    },

    props: {
      data: {
        type: Object
      },
      parentid: {
        type: String
      },
      index: {
        type: Number
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
      },
      previd: {
        type: String
      }
    },

    computed: {},

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
      deleteOutline (param) {
        this.$store.dispatch('deleteOutline', param)
      },
      deleteCurrentOutline () {
        const parentid = this.parentid
        const _id = this._id
        const param = {
          parentid: parentid,
          _id: _id
        }
        this.deleteOutline(param)
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
          attributes: { text: text }
        })
        return data
      },
      addOutline (param) {
        this.$store.dispatch('addOutline', param)
      },
      deleteOutlineChildren (_id, parentid) {
        this.$store.dispatch('deleteOutlineChildren', { _id, parentid })
      },
      moveOutlineToTargetOutline (_id, targetid) {
        // 更新当前节点，将该节点设置为其目标节点的子节点
        this.$store.dispatch('addOutlineChildren', { _id, targetid })
      },
      handleKeypressEnter (evt) {
        this.disableEditable()
        // 没有文字，将该节点层级往上推上一层，设置为其父节点的下一个节点
        if (evt.target.textContent === '') {
          console.log('kkk')
        } else { // 有文字，更新该节点，并且添加一个新的节点
          this.updateOutline(this.updateOutlineText(evt.target.textContent))
          const parentid = this.parentid
          const _id = this._id
          const param = { parentid: parentid, previd: _id }
          this.addOutline(param)
        }
      },
      handleTextClick () {
        this.enableEditable()
      },
      handleTextInput (evt) {
        this.updateOutline(this.updateOutlineText(evt.target.textContent))
      },
      handleKeyupDelete (evt) {
        if (evt.target.textContent === '') {
          this.deleteCurrentOutline()
        }
      },
      handleKeydownTab (evt) {
        console.log(this.index)
        // 没有文字，删除当前节点，为前一个节点增加子节点
        if (
          evt.target.textContent === '' &&
          typeof this.index === 'number' &&
          this.index > 0
        ) {
          this.deleteOutlineChildren(this._id, this.parentid)
          const parentid = this.previd
          const param = { parentid: parentid }
          this.addOutline(param)
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
