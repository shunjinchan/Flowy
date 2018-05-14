<template>
  <div class="node-text">
    <collapse-button v-if="renderCollapseButton"
                     :handleClick="collapseChildren" />
    <expand-button v-if="renderExpandButton"
                   :handleClick="expandChildren" />
    <bullet-button :_id="_id" />
    <text-field :text="text"
                :editable="editable"
                :handleKeypressEnter="handleKeypressEnter"
                :handleKeydownDelete="handleKeydownDelete"
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
        editable: false
      }
    },

    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      parentid: {
        type: String
      },
      previd: {
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
      }
  
    },

    computed: {
      _id () {
        return this.data._id
      },
      text () {
        // 响应式：更新会将输入框的聚焦状态置换到首字符之前
        // 不是响应式：无法响应更新，例如路由跳转后
        return _.get(this.data, 'attributes.text') || ''
      }
    },

    components: {
      CollapseButton,
      ExpandButton,
      BulletButton,
      TextField
    },

    methods: {
      addOutline (param) {
        this.$store.dispatch('addOutline', param)
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
      deleteOutlineChildren (_id, parentid) {
        this.$store.dispatch('deleteOutlineChildren', { _id, parentid })
      },
      // 将节点设置为其目标节点的子节点
      moveOutlineToTargetOutline (_id, targetid) {
        this.$store.dispatch('addOutlineChildren', { _id, targetid })
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
      handleTextClick () {
        this.enableEditable()
      },
      handleTextInput (evt) {
        this.updateOutline(this.updateOutlineText(evt.target.textContent))
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
      handleKeydownDelete (evt) {
        if (evt.target.textContent === '') {
          this.deleteCurrentOutline()
        }
      },
      handleKeydownTab (evt) {
        if (this.index < 1) return
        // 缩进节点
        if (evt.target.textContent === '') {
          this.deleteOutlineChildren(this._id, this.parentid)
          const parentid = this.previd
          const param = { parentid: parentid }
          this.addOutline(param)
        } else {
          this.deleteOutlineChildren(this._id, this.parentid)
          this.moveOutlineToTargetOutline(this._id, this.previd)
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
      opacity: 0;
    }
    &:hover {
      .collapse-button, .expand-button {
        opacity: 1;
      }
    }
  }
</style>
