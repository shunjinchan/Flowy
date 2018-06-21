import _ from 'lodash'

function swapNodePosition (sourceid, targetid, parentid) {
  const parentNode = _.cloneDeep(this.$store.state.node[parentid])
  const sourceIndex = parentNode.children.indexOf(sourceid)
  const targetIndex = parentNode.children.indexOf(targetid)

  parentNode.children[targetIndex] = sourceid
  parentNode.children[sourceIndex] = targetid
  this.updateNode(parentNode)
}

function moveNodeUp ({ evt, lastEditNode }) {
  if (this._id !== lastEditNode || !this.previd) return

  this.updateNode(this.updateNodeText(evt.target.innerHTML))
  swapNodePosition.call(this, this._id, this.previd, this.parentid)
}

function moveNodeDown ({ evt, lastEditNode }) {
  if (this._id !== lastEditNode || !this.nextid) return

  this.updateNode(this.updateNodeText(evt.target.innerHTML))
  swapNodePosition.call(this, this._id, this.nextid, this.parentid)
}

export { moveNodeUp, moveNodeDown }
