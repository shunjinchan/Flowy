class Node {
  constructor (data) {
    this.data = data
    this.parent = null
    this.children = []
  }
}

function findIndex (arr, data) {
  let index

  arr.forEach((item, i) => {
    if (item.data === data) index = i
  })

  return index
}

class Tree {
  constructor (data) {
    this.root = new Node(data)
  }

  traverseDF (callback) {
    function recurse (node) {
      callback(node)
      node.children.forEach(child => {
        recurse(child)
      })
    }
    recurse(this.root)
  }

  traverseBF (callback) {
    let queue = [this.root]
    let currentTree = queue.shift()

    while (currentTree) {
      currentTree.children.forEach(child => {
        queue.push(child)
      })

      callback(currentTree)
      currentTree = queue.shift()
    }
  }

  contains (callback, traversal = this.traverseBF) {
    traversal.call(this, callback)
  }

  add (data, toData, traversal) {
    let child = new Node(data)
    let parent = null
    let callback = (node) => {
      if (node.data === toData) {
        parent = node
      }
    }

    this.contains(callback, traversal)

    if (parent) {
      parent.children.push(child)
      child.parent = parent
    } else {
      throw new Error('Cannot add node to a non-existent parent.')
    }
  }

  remove (data, fromData, traversal) {
    let parent = null
    let childToRemove = null
    let index

    let callback = function (node) {
      if (node.data === fromData) {
        parent = node
      }
    }

    this.contains(callback, traversal)

    if (parent) {
      index = findIndex(parent.children, data)

      if (index === undefined) {
        throw new Error('Node to remove does not exist.')
      } else {
        childToRemove = parent.children.splice(index, 1)
      }
    } else {
      throw new Error('Parent does not exist.')
    }

    return childToRemove
  }
}

export default Tree
