import _ from 'lodash'

/**
 * 交换节点位置
 * @param {string} sourceid
 * @param {string} targetid
 * @param {string} parentid
 */
function swapNodePosition (sourceid, targetid, parentid) {
  const parentNode = _.cloneDeep(this.$store.state.node[parentid])
  const parentChildren = parentNode.children
  const sourceIndex = parentChildren.indexOf(sourceid)
  const targetIndex = parentChildren.indexOf(targetid)

  parentChildren[targetIndex] = sourceid
  parentChildren[sourceIndex] = targetid
  this.updateNode(parentNode)
}

/**
 * 向上移动节点
 * @param {{evt: Event, lastEditNode: string}} param0
 */
function moveNodeUp ({ evt, lastEditNode }) {
  if (this._id !== lastEditNode || !this.previd) return

  this.updateNode(this.updateNodeText(evt.target.innerHTML))
  swapNodePosition.call(this, this._id, this.previd, this.parentid)
}

/**
 * 向下移动节点
 * @param {{evt: Event, lastEditNode: string}} param0
 */
function moveNodeDown ({ evt, lastEditNode }) {
  if (this._id !== lastEditNode || !this.nextid) return

  this.updateNode(this.updateNodeText(evt.target.innerHTML))
  swapNodePosition.call(this, this._id, this.nextid, this.parentid)
}

export { moveNodeUp, moveNodeDown }
