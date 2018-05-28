import _ from 'lodash'
import db from '@/datastore'
import {
  getAllNode,
  insertNode,
  getNode
} from '../../../services/node.services'

export default {
  async getNode ({ commit, state }, { _id }) {
    const node = await getNode(_id)
    return node
  },

  async getAllNode ({ commit, state }) {
    const nodeList = await getAllNode()
    return nodeList
  },

  /**
   * 插入空的新节点
   * @param commit
   * @param data
   * @returns {Promise<object>}
   */
  async insertNode ({ commit }, { parentid = '' }) {
    const newNode = await insertNode({
      attributes: { text: '', note: '' },
      children: [],
      parentid: parentid
    })
    commit('insertNode', newNode)

    return newNode
  },

  async getRootNode ({ commit, dispatch, state }, { _id }) {
    let nodeList = await dispatch('getAllNode')
    let rootNode = {}

    if (!nodeList || _.isEmpty(nodeList)) {
      rootNode = await insertNode({
        attributes: { text: 'Home', note: '' },
        children: [],
        parentid: '',
        _id: 'root'
      })
      commit('insertNode', rootNode)
    } else {
      nodeList.forEach(node => {
        if (node._id === _id) rootNode = node
      })
      commit('setAllNode', nodeList)
    }
    if (!rootNode.children || rootNode.children.length === 0) {
      await dispatch('addNode', { parentid: rootNode._id })
    }

    return rootNode
  },

  /**
   * 添加节点，同样会在其父节点的 node 属性中增加该新节点的 id
   * @param commit
   * @param parentid 父节点 id
   * @param previd 上一个节点 id，根据这个节点 id 选择插入位置
   * @returns {Promise<object>}
   */
  async addNode ({ commit, dispatch }, { parentid, previd }) {
    let parentNode = await dispatch('getNode', { _id: parentid })
    let newNode

    if (parentNode && !_.isEmpty(parentNode)) {
      newNode = await dispatch('insertNode', { parentid })

      // 更新父节点
      if (newNode && !_.isEmpty(newNode)) {
        // 有前一个相邻节点
        if (previd) {
          let index = parentNode.children.indexOf(previd)
          parentNode.children.splice(index + 1, 0, newNode._id)
        } else {
          parentNode.children.push(newNode._id)
        }

        parentNode = await dispatch('updateNode', parentNode)
      }
    }

    return newNode
  },

  async deleteNode ({ commit, dispatch }, { parentid, _id }) {
    const numRemoved = await db.removeAsync({ _id: _id })
    const parentNode = await db.findOneAsync({ _id: parentid })

    // 更新父节点
    if (parentNode !== undefined && !_.isEmpty(parentNode)) {
      const index = parentNode.children.indexOf(_id)
      parentNode.children.splice(index, 1)
      await dispatch('updateNode', parentNode)
    }

    return numRemoved
  },

  /**
   * 清空所有节点，并执行一次初始化一次应用
   * @param commit
   * @returns {Promise<number>}
   */
  async emptyAllNode ({ commit, dispatch }) {
    const numRemoved = await db.removeAsync({}, { multi: true })
    // commit('emptyAllNode')
    // await dispatch('initRootNode')
    // await dispatch('addNode', { parentid: 'root' })
    return numRemoved
  },

  /**
   * 更新节点
   * @param commit
   * @param NodeData
   * @returns {Promise<object>}
   */
  async updateNode ({ commit }, NodeData) {
    const { affectedDocuments } = await db.updateAsync(
      { _id: NodeData._id },
      NodeData,
      { returnUpdatedDocs: true }
    )
    if (affectedDocuments !== undefined && !_.isEmpty(affectedDocuments)) {
      commit('updateNode', affectedDocuments)
    }
    return affectedDocuments
  },

  /**
   * 懒更新节点数据，非响应式
   * @param commit
   * @param NodeData
   * @returns {Promise<object>}
   */
  async lazyupdateNode ({ commit }, NodeData) {
    const { affectedDocuments } = await db.updateAsync(
      { _id: NodeData._id },
      NodeData,
      { returnUpdatedDocs: true }
    )
    return affectedDocuments
  },

  async deleteNodeChildren ({ commit, dispatch }, { _id, parentid }) {
    let parentNode = await db.findOneAsync({ _id: parentid })

    // 更新父节点
    if (parentNode !== undefined && !_.isEmpty(parentNode)) {
      const index = parentNode.children.indexOf(_id)
      parentNode.children.splice(index, 1)
      parentNode = await dispatch('updateNode', parentNode)
    }

    return parentNode
  },

  async addNodeChildren ({ commit, dispatch }, { _id, targetid }) {
    let targetNode = await db.findOneAsync({ _id: targetid })

    // 更新目标节点
    if (targetNode !== undefined && !_.isEmpty(targetNode)) {
      targetNode.children.push(_id)
      targetNode = await dispatch('updateNode', targetNode)
    }

    return targetNode
  }
}
