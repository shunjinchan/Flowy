import _ from 'lodash'
import NodeNote from './NodeNote'
import NodeText from './NodeText'
import NodeChildren from './NodeChildren'
import { selecePrevNode, selectNextNode } from './selectNode'
import { moveNodeDown, moveNodeUp } from './moveNode'

export default {
  name: 'node',

  data () {
    return {
      isFocus: false,
      isSelected: false
    }
  },

  props: {
    nodeData: {
      type: Object,
      require: true,
      default () {
        return {}
      }
    }
  },

  render (h) {
    const nodeChildren = (
      (this.hasChildren && this.isExpanded) ? (
        <node-children
          nodeData={this.nodeData}
          parentid={this.parentid} />
      ) : null
    )

    const nodeNode = (
      <node-note
        nodeData={this.nodeData}
        parentid={this.parentid}
        updateNode={this.updateNode} />
    )

    const nodeText = (
      <node-text
        nodeData={this.nodeData}
        index={this.index}
        previd={this.previd}
        nextid={this.nextid}
        parentid={this.parentid}
        grandparentid={this.grandparentid}
        isFocusTextField={this.isFocusTextField}
        isCollapsed={this.isCollapsed}
        renderCollapseButton={this.hasChildren && this.isExpanded}
        renderExpandButton={this.hasChildren && this.isCollapsed}
        collapseChildren={this.collapseChildren}
        expandChildren={this.expandChildren}
        lazyUpdateNode={this.lazyUpdateNode}
        updateNodeText={this.updateNodeText}
        mergeNodeData={this.mergeNodeData}
        handleTextFocus={this.handleTextFocus}
        handleTextBlur={this.handleTextBlur}
        deleteNode={this.deleteNode}
        updateNode={this.updateNode} />
    )

    return (
      <section
        class={{
          node: true,
          focus: this.isFocusTextField,
          selected: this.isSelected
        }}
        data-id={this.nodeData._id}>
        {nodeText}
        {nodeNode}
        {nodeChildren}
      </section>
    )
  },

  components: {
    NodeNote,
    NodeText,
    NodeChildren
  },

  computed: {
    _id () {
      return this.nodeData._id
    },

    previd () {
      let previd = ''
      if (
        this.parentid &&
        this.nodeData._id &&
        this.index >= 1
      ) {
        previd = this.parentChildren[this.index - 1]
      }
      return previd
    },

    nextid () {
      let nextid = ''
      if (
        this.parentid &&
        this.nodeData._id &&
        this.index < this.parentChildren.length - 1
      ) {
        nextid = this.parentChildren[this.index + 1]
      }
      return nextid
    },

    parentid () {
      return this.nodeData.parentid || ''
    },

    grandparentid () {
      let grandparentid = ''
      if (this.parentid) {
        const parentNode = this.$store.getters.getNode(this.parentid)
        grandparentid = parentNode ? parentNode.parentid : ''
      }
      return grandparentid
    },

    children () {
      return _.get(this.nodeData, 'children') || []
    },

    // 父节点的子节点数组，主要用于计算当前节点索引值与查找相邻节点
    parentChildren () {
      if (this.parentid) {
        return this.$store.getters.getNode(this.parentid).children
      } else {
        return [this.nodeData._id]
      }
    },

    index () {
      return this.parentChildren.indexOf(this.nodeData._id)
    },

    hasChildren () {
      return this.children && this.children.length > 0
    },

    isLeaf () {
      return this.children && this.children.length === 0
    },

    // node-children 默认展开，如果要折叠就将 isExpanded 设置为 false
    isExpanded () {
      return _.get(this.nodeData, 'attributes.isExpanded') !== false
    },

    isCollapsed () {
      return !this.isExpanded
    },

    lastEditNode () {
      return this.$store.getters.lastEditNode
    },

    isFocusTextField () {
      // 当前节点 id 与最后编辑的节点 id相等且在非选择模式下，focus 状态才为 true
      if (this.lastEditNode === this.nodeData._id && !this.selectionMode) {
        return true
      }
      return false
    },

    selection () {
      return this.$store.state.selection.list
    },

    selectionDirection () {
      return this.$store.state.selection.direction
    },

    selectionMode () {
      return this.$store.getters.selectionMode
    }
  },

  watch: {
    selection () {
      if (this.selection.some(_id => this._id === _id)) {
        this.isSelected = true
      } else {
        this.isSelected = false
      }
    }
  },

  methods: {
    async updateNode (nodeData) {
      this.$store.commit('updateNode', nodeData)
      const affectedDocuments = await this.$store.dispatch(
        'updateNode', nodeData
      )
      return affectedDocuments
    },

    async lazyUpdateNode (nodeData) {
      const affectedDocuments = await this.$store.dispatch(
        'updateNode', nodeData
      )
      return affectedDocuments
    },

    async deleteNode (_id) {
      this.$store.commit('deleteNode', _id)
      const numRemoved = await this.$store.dispatch(
        'deleteNode', _id
      )
      return numRemoved
    },

    updateLastEditNode (_id) {
      this.$store.commit('updateLastEditNode', _id)
    },

    mergeNodeData (data) {
      return _.merge({}, this.nodeData, data)
    },

    updateNodeText (text) {
      const data = this.mergeNodeData({
        attributes: { text: text }
      })

      return data
    },

    collapseChildren () {
      const data = this.mergeNodeData({
        attributes: { isExpanded: false }
      })
      this.updateNode(data)
    },

    expandChildren () {
      const data = this.mergeNodeData({
        attributes: { isExpanded: true }
      })
      this.updateNode(data)
    },

    // text field
    handleTextFocus (evt) {
      this.$store.commit('updateLastEditNode', this._id)
      this.$store.commit('updateTextFieldFocusStatus', true)
    },

    handleTextBlur (evt) {
      // onblur 时不要更新节点数据，原因：组件销毁（如缩进操作）会更新一次节点数据，
      // 同时也会触发 onblur 事件，但是缩进过后其父节点已经被改变，而 onblur 事件处理函数无法得知该情况
      this.$store.commit('updateTextFieldFocusStatus', false)
    },

    bindEvents () {
      // TODO: 更换节点位置支持跨层级
      this.$root.$on('command:moveNodeUp', moveNodeUp.bind(this))
      this.$root.$on('command:moveNodeDown', moveNodeDown.bind(this))
      this.$root.$on('command:selectPrevNode', selecePrevNode.bind(this))
      this.$root.$on('command:selectNextNode', selectNextNode.bind(this))
    }
  },

  mounted () {
    this.bindEvents()
  },

  beforeDestroy () {
    this.$root.$off('command:moveNodeUp', moveNodeUp)
    this.$root.$off('command:moveNodeDown', moveNodeDown)
    this.$root.$off('command:selectPrevNode', selecePrevNode)
    this.$root.$off('command:selectNextNode', selectNextNode)
  }
}
