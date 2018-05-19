<template>
  <div class="node-text">
    <collapse-button v-if="renderCollapseButton"
                     :handleClick="collapseChildren" />
    <expand-button v-if="renderExpandButton"
                   :handleClick="expandChildren" />
    <bullet-button :isCollapsed="isCollapsed"
                   :handleClick="handleBulletClick" />
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
    grandparentid: {
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
    isCollapsed: {
      type: Boolean
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
    async addOutline (param) {
      const newOutlineData = await this.$store.dispatch('addOutline', param)
      return newOutlineData
    },
    async deleteOutline (param) {
      const numRemoved = await this.$store.dispatch('deleteOutline', param)
      return numRemoved
    },
    async deleteOutlineChildren (_id, parentid) {
      const parentOutlineData = await this.$store.dispatch('deleteOutlineChildren', { _id, parentid })
      return parentOutlineData
    },
    // 将节点设置为其目标节点的子节点
    async moveOutlineToTargetOutline (_id, targetid) {
      const targetOutlineData = await this.$store.dispatch('addOutlineChildren', { _id, targetid })
      return targetOutlineData
    },

    // bullet-button
    handleBulletClick () {
      this.$router.push({ path: this._id })
      this.$store.dispatch('updateCrumb', this._id)
    },

    // text-field
    deleteCurrentOutline () {
      const parentid = this.parentid
      const _id = this._id
      const param = { parentid: parentid, _id: _id }
      this.deleteOutline(param)
    },
    updateOutlineText (text) {
      const data = _.merge({}, this.data, {
        attributes: { text: text }
      })
      return data
    },
    updateOutlineParentid (_id) {
      const data = _.merge({}, this.data, {
        parentid: _id
      })
      return data
    },
    handleTextClick (evt) {},
    handleTextFocus (evt) {},
    handleTextInput (evt) {
      this.lazyUpdateOutline(this.updateOutlineText(evt.target.textContent))
    },
    async handleKeypressEnter (evt) {
      // 更新该节点，并为父节点添加一个新的子节点
      const updateOutline = () => {
        const parentid = this.parentid
        const _id = this._id
        this.addOutline({ parentid: parentid, previd: _id })
      }

      if (evt.target.textContent === '') {
        await this.updateOutline(this.updateOutlineText(evt.target.textContent))
        // indentLeft
        // 将该节点从父节点的子节点数组中移除
        await this.deleteOutlineChildren(this._id, this.parentid)
        // 将该节点添加到其祖父节点的子节点数组中
        await this.moveOutlineToTargetOutline(this._id, this.grandparentid)
        // 更新节点的 parentid
        await this.updateOutline(this.updateOutlineParentid(this.grandparentid))
      } else {
        updateOutline()
      }
    },
    handleKeydownDelete (evt) {
      if (evt.target.textContent === '') {
        this.deleteCurrentOutline()
      }
    },
    async handleKeydownTab (evt) {
      if (this.index < 1) return

      // 由于在输入的时候文本框的内容是非响应式的，缩进的操作是重新实例化一个节点组件，所以需要先更新数据再缩进
      await this.updateOutline(this.updateOutlineText(evt.target.textContent))
      // indentRight
      // 将该节点从父节点的子节点数组中移除
      await this.deleteOutlineChildren(this._id, this.parentid)
      // 将该节点添加到前一个节点的子节点数组中
      await this.moveOutlineToTargetOutline(this._id, this.previd)
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
