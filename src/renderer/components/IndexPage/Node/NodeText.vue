<script>
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
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
    nodeData: {
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
    nextid: {
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
    isFocusTextField: {
      type: Boolean
    },
    expandChildren: {
      type: Function
    },
    handleTextFocus: {
      type: Function
    },
    handleTextBlur: {
      type: Function
    },
    updateNodeText: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    mergeNodeData: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    lazyUpdateNode: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    updateNode: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    deleteNode: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    }
  },

  render (h) {
    const collapseButton = this.renderCollapseButton ? (
      <collapse-button handleClick={this.collapseChildren} />
    ) : null
    const expandButton = this.renderExpandButton ? (
      <expand-button handleClick={this.expandChildren} />
    ) : null
    const bulletButton = (
      <bullet-button
        isCollapsed={this.isCollapsed}
        handleClick={this.handleBulletClick} />
    )
    const textField = (
      <text-field
        text={this.text}
        isFocus={this.isFocusTextField}
        handleBlur={this.handleTextBlur}
        handleFocus={this.handleTextFocus}
        handleKeydownEnter={this.handleKeydownEnter}
        handleKeydownDelete={this.handleKeydownDelete}
        handleInput={this.handleTextInput} />
    )

    return (
      <div class="node-text">
        {collapseButton}
        {expandButton}
        {bulletButton}
        {textField}
      </div>
    )
  },

  computed: {
    _id () {
      return this.nodeData._id
    },
    text () {
      // 响应式：更新会将输入框的聚焦状态置换到首字符之前
      // 不是响应式：无法响应更新，例如路由跳转后
      return _.get(this.nodeData, 'attributes.text') || ''
    }
  },

  components: {
    CollapseButton,
    ExpandButton,
    BulletButton,
    TextField
  },

  methods: {
    // bullet-button
    handleBulletClick (evt) {
      evt.preventDefault()
      this.$router.push({ path: this._id })
      this.$store.dispatch('updateCrumb', this._id)
    },

    // text-field
    addNodeToTargetNode (_id, targetid, previd) {
      const targetNode = _.cloneDeep(this.$store.state.node[targetid])

      // 有前一个相邻节点
      if (previd) {
        let index = targetNode.children.indexOf(previd)
        targetNode.children.splice(index + 1, 0, _id)
      } else {
        targetNode.children.push(_id)
      }

      this.updateNode(targetNode)
    },

    addNode (parentid) {
      const _id = uuidv4()
      const newNode = {
        attributes: { text: '', note: '', isExpanded: true },
        children: [],
        parentid: parentid,
        _id: _id
      }

      this.$store.commit('addNode', newNode)
      this.$store.dispatch('addNode', newNode)

      return newNode
    },

    deleteNodeFromSourceNode (_id, sourceid) {
      const sourceNode = _.cloneDeep(this.$store.state.node[sourceid])
      const index = sourceNode.children.indexOf(_id)

      sourceNode.children.splice(index, 1)
      this.updateNode(sourceNode)
    },

    moveNodeToTargetNode (_id, targetid, previd) {
      const targetNode = _.cloneDeep(this.$store.state.node[targetid])

      if (previd) {
        let index = targetNode.children.indexOf(previd)
        targetNode.children.splice(index + 1, 0, _id)
      } else {
        targetNode.children.push(_id)
      }

      this.updateNode(targetNode)
    },

    indentRight (text) {
      const previd = this.previd
      const _id = this._id
      const parentid = this.parentid

      this.deleteNodeFromSourceNode(_id, parentid)
      this.moveNodeToTargetNode(_id, previd)
      this.updateNode(this.mergeNodeData({
        parentid: previd,
        attributes: { text: text }
      }))
    },

    indentLeft (text) {
      const grandparentid = this.grandparentid
      const _id = this._id
      const parentid = this.parentid

      this.deleteNodeFromSourceNode(_id, parentid)
      this.moveNodeToTargetNode(_id, grandparentid, parentid)
      this.updateNode(this.mergeNodeData({
        parentid: grandparentid,
        attributes: { text: text }
      }))
    },

    handleTextInput (text) {
      this.lazyUpdateNode(this.updateNodeText(text))
    },

    handleKeydownEnter (evt) {
      const parentid = this.parentid
      const _id = this._id
      const text = evt.target.innerHTML

      evt.preventDefault()
      this.updateNode(this.updateNodeText(text))
      if (text !== '') {
        const newNode = this.addNode(parentid)
        this.addNodeToTargetNode(newNode._id, parentid, _id)
        this.$store.commit('updateLastEditNode', newNode._id)
      }
    },

    handleKeydownDelete (evt) {
      const previd = this.previd
      const text = evt.target.innerHTML
      const parentid = this.parentid
      const _id = this._id

      if (text === '') {
        //  最后一个根节点的子节点不需要删除
        if (parentid === 'root' && this.index === 0) return

        evt.preventDefault()
        this.deleteNodeFromSourceNode(_id, parentid)
        this.deleteNode(this.nodeData._id)
        if (previd) {
          this.$store.commit('updateLastEditNode', previd)
        }
      }
    },

    handleIndentRight ({evt, lastEditNode}) {
      // 第一个子节点不需要右缩进
      if (this.index < 1) return
      if (this._id === lastEditNode) this.indentRight(evt.target.innerHTML)
    },

    handleIndentLeft ({evt, lastEditNode}) {
      // 父节点是根节点，不需要左缩进
      if (this.parentid === 'root') return
      if (this._id === lastEditNode) this.indentLeft(evt.target.innerHTML)
    },

    handleKeydownShiftAndEnter (evt) {
      debugger
    },

    handleFocusPrevNode ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode) return

      const previd = this.previd
      const parentid = this.parentid

      const findPrevNode = (_id) => {
        const node = this.$store.getters.getNode(_id)
        const nodeChildren = node.children
        // 折叠的节点不需要检查其子节点
        if (node.attributes.isExpanded === false) {
          return _id
        }
        // 如果前一个节点有子节点，找到其最后的子节点
        if (nodeChildren.length > 0) {
          return findPrevNode(nodeChildren[nodeChildren.length - 1])
        }
        return _id
      }

      if (previd) {
        this.$store.commit('updateLastEditNode', findPrevNode(previd))
        return
      }

      if (parentid) {
        this.$store.commit('updateLastEditNode', parentid)
      }
    },

    handleFocusNextNode ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode) return

      const nextid = this.nextid
      const _id = this._id

      const findTheFirstChildNode = (_id) => {
        const node = this.$store.getters.getNode(_id)
        const nodeChildren = node.children
        // 节点没折叠且有子节点
        if (
          node.attributes.isExpanded !== false &&
          nodeChildren &&
          nodeChildren.length > 0
        ) {
          return nodeChildren[0]
        }
        return null
      }

      const findParentNextNode = (_id) => {
        const node = this.$store.getters.getNode(_id)
        const parentid = node.parentid

        // 如果没有父节点，直接定位到当前 id，有且仅有 root 节点没有父节点
        if (!parentid) return _id

        const parentNode = this.$store.getters.getNode(parentid)
        const index = parentNode.children.indexOf(_id)

        // 该节点为当前层级节点的最后一个节点，递归往上查找
        if (index >= parentNode.children.length - 1) {
          return findParentNextNode(parentid)
        } else {
          return parentNode.children[index + 1]
        }
      }

      // 查找顺序：当前节点子节点 -> 当前节点下一个节点 -> 当前节点父节点的下一个节点
      // 如果有子节点且子节点是展开状态
      if (findTheFirstChildNode(_id)) {
        this.$store.commit('updateLastEditNode', findTheFirstChildNode(_id))
        return
      }

      // 如果有下一个节点
      if (nextid) {
        this.$store.commit('updateLastEditNode', nextid)
        return
      }

      // 该节点的上一层级节点的下一个节点
      this.$store.commit(
        'updateLastEditNode',
        findParentNextNode(_id)
      )
    },

    bindEvents () {
      // 缩进
      this.$root.$on('command:indentRight', this.handleIndentRight)
      this.$root.$on('command:indentLeft', this.handleIndentLeft)
      // 上下切换节点聚焦状态
      this.$root.$on('command:focusPrevNode', this.handleFocusPrevNode)
      this.$root.$on('command:focusNextNode', this.handleFocusNextNode)
    }
  },

  mounted () {
    this.bindEvents()
  },

  beforeDestroy () {
    this.$root.$off('command:indentRight', this.handleIndentRight)
    this.$root.$off('command:indentLeft', this.handleIndentLeft)
    this.$root.$off('command:focusPrevNode', this.handleFocusPrevNode)
    this.$root.$off('command:focusNextNode', this.handleFocusNextNode)
  }
}
</script>

<style lang="scss">
.node-text {
  display: flex;
  line-height: 20px;
  padding-top: 3px;
  position: relative;
  .simple-text {
    flex-grow: 1;
    blockquote {
      margin: 0;
      color: #777;
      border-left: 3px solid #DCDCDC;
      padding-left: 10px;
    }
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
  span {
    background-color: #abcdef;
    margin-left: 10px;
    font-size: 12px;
  }
}
</style>
