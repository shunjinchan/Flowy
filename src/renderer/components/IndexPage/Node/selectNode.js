import { logger } from '@/modules/logger'

function getParentNextNodeid (_id) {
  const node = this.$store.getters.getNode(_id)

  if (!node) return null
  // 如果没有父节点，直接定位到当前 id，正常情况下有且仅有 root 节点没有父节点
  if (!node.parentid) return _id

  const parentid = node.parentid
  const parentNode = this.$store.getters.getNode(parentid)

  if (
    parentNode &&
    parentNode.children &&
    parentNode.children.indexOf(_id) > -1
  ) {
    const children = parentNode.children
    const index = children.indexOf(_id)

    // 该节点为当前层级节点的最后一个节点，递归往上查找
    if (index >= children.length - 1) {
      return getParentNextNodeid.call(this, parentid)
    } else {
      return children[index + 1]
    }
  } else {
    logger.error({
      msg: `没有找到 _id 为 ${_id} 的父节点`
    })
    return null
  }
}

function getPrevNodeid () {
  // 没有 parent id 说明已经到根节点了
  return this.previd || this.parentid || 'root'
}

function getNextNodeid () {
  if (this.nextid) return this.nextid
  return getParentNextNodeid.call(this, this._id)
}

function selectNode (_id) {
  this.$store.commit('addSelctionNode', _id)
}

function unselectNode (_id) {
  this.$store.commit('removeSelectionNode', _id)
}

function updateSelectionDirection (direction) {
  this.$store.commit('updateSelectionDirection', direction)
}

/**
 * 选择上一个节点
 * @param {{evt: Event, lastEditNode: string}} param0
 */
function selecePrevNode ({ evt, lastEditNode }) {
  // 输入模式下需要比对 id 是否一致
  if (this._id !== lastEditNode) return

  // 只剩下一个选择的节点之后，强行更正选择方向
  if (this.selection.length === 1) {
    updateSelectionDirection.call(this, 'up')
  }

  // 首次选择，选择当前节点，并且记录选择方向
  if (this.selectionDirection === '') {
    selectNode.call(this, this._id)
    this.updateLastEditNode(this._id)
    updateSelectionDirection.call(this, 'up')
    return
  }

  // 非首次选择，选择前一个节点
  if (this.selectionDirection === 'up') {
    const prevNodeid = getPrevNodeid.call(this)
    selectNode.call(this, prevNodeid)
    this.updateLastEditNode(prevNodeid)
    return
  }

  // 逆向选择，从已选择节点的队列中删除节点，并更新下一个节点为队列中的最后一个节点
  if (this.selectionDirection === 'down') {
    unselectNode.call(this)
    this.updateLastEditNode(this.$store.state.selection.lastNodeid)
  }
}

/**
 * 选择下一个节点
 * @param {{evt: Event, lastEditNode: string}} param0
 */
function selectNextNode ({ evt, lastEditNode }) {
  if (this._id !== lastEditNode) return

  // 只剩下一个选择的节点之后，强行更正选择方向
  if (this.selection.length === 1) {
    updateSelectionDirection.call(this, 'down')
  }

  if (this.selectionDirection === '') {
    selectNode.call(this, this._id)
    this.updateLastEditNode(this._id)
    updateSelectionDirection.call(this, 'down')
    return
  }

  if (this.selectionDirection === 'down') {
    const nextNodeid = getNextNodeid.call(this)
    selectNode.call(this, nextNodeid)
    this.updateLastEditNode(nextNodeid)
    return
  }

  if (this.selectionDirection === 'up') {
    unselectNode.call(this)
    this.updateLastEditNode(this.$store.state.selection.lastNodeid)
  }
}

export { selecePrevNode, selectNextNode }
