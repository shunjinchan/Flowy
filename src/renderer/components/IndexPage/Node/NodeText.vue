<template>
  <div class="node-text">
    <collapse-button v-if="renderCollapseButton"
                     :handleClick="collapseChildren" />
    <expand-button v-if="renderExpandButton"
                   :handleClick="expandChildren" />
    <bullet-button :_id="_id" />
    <text-field :text="text"
                :handleKeypressEnter="handleKeypressEnter"
                :handleKeydownDelete="handleKeydownDelete"
                :handleKeydownTab="handleKeydownTab"
                :handleClick="handleTextClick"
                :handleFocus="handleTextFocus"
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
      editable: true
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
    lazyUpdateOutline: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    updateOutline: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    currentOutlineid: {
      type: String
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
    },
    focus () {
      return this.currentOutlineid === this._id
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
      const param = { parentid: parentid, _id: _id }
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
    updateOutlineText (text) {
      const data = _.merge({}, this.data, {
        attributes: { text: text }
      })
      return data
    },
    handleTextClick () {},
    handleTextFocus (evt) {},
    handleTextInput (evt) {
      this.lazyUpdateOutline(this.updateOutlineText(evt.target.textContent))
    },
    handleKeypressEnter (evt) {
      // const indentLeft = () => {
      //   // 将该节点从父节点的子节点数组中移除
      //   this.deleteOutlineChildren(this._id, this.parentid)
      //   // 将该节点添加到前一个节点的子节点数组中
      //   this.moveOutlineToTargetOutline(this._id, this.previd)
      // }
      // 更新该节点，并为父节点添加一个新的子节点
      const updateOutline = () => {
        this.lazyUpdateOutline(this.updateOutlineText(evt.target.textContent))
        const parentid = this.parentid
        const _id = this._id
        this.addOutline({ parentid: parentid, previd: _id })
      }

      if (evt.target.textContent === '') {
        // indentLeft()
      } else {
        updateOutline()
      }
    },
    handleKeydownDelete (evt) {
      if (evt.target.textContent === '') {
        this.deleteCurrentOutline()
      }
    },
    handleKeydownTab (evt) {
      if (this.index < 1) return

      const indentRight = () => {
        // 将该节点从父节点的子节点数组中移除
        this.deleteOutlineChildren(this._id, this.parentid)
        // 将该节点添加到前一个节点的子节点数组中
        this.moveOutlineToTargetOutline(this._id, this.previd)
      }

      // 缩进节点
      indentRight()
      this.updateOutline(this.updateOutlineText(evt.target.textContent))
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
