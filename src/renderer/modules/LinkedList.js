class Node {
  constructor (element) {
    this.element = element
    this.next = null
  }
}

class LinkedList {
  constructor () {
    this.head = null
    this.length = 0
  }
  append (element) {
    let node = new Node(element)
    let current = null

    if (this.head === null) {
      this.head = node
    } else {
      current = this.head
      while (current.next) current = current.next
      current.next = node
    }
    this.length++
  }
  /**
   * 移除节点
   * @param {number} position 0 到 this.length - 1
   */
  removeAt (position) {
    if (position >= 0 && position < this.length) {
      let current = this.head
      let index = 0
      let prev

      if (position === 0) {
        this.head = current.next
      } else {
        while (index < position) {
          prev = current
          current = current.next
          index++
        }
        prev.next = current.next
      }

      this.length--
      return current.element
    } else {
      return null
    }
  }
  insert (position, element) {
    if (position >= 0 && position <= this.length) {
      let node = new Node(element)
      let current = this.head
      let index = 0
      let prev

      if (position === 0) {
        this.head = node
        node.next = current
      } else {
        while (index < position) {
          prev = current
          current = current.next
          index++
        }
        node.next = current
        prev.next = node
      }

      return true
    } else {
      return false
    }
  }
  remove () {}
  toString () {
    let current = this.head
    let res = ''

    while (current) {
      res += res === '' ? current.element : `,${current.element}`
      current = current.next
    }

    return res
  }
  indexOf (element) {}
}

const list = new LinkedList()
list.append(1)
list.append(2)
list.append(3)
list.append(4)
console.log(list.toString())
// list.insert(2, 22)
list.insert(4, 22)
console.log(list.toString())
