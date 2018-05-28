import _ from 'lodash'
import db from '@/datastore'
// import { getAllNode, insertNode } from '../../../services/node.services'

export default {
  /**
   * 初始化根节点
   * @param commit
   * @returns {Promise<object>}
   */
  async initRootNode ({ commit, state }) {
    let data = await db.findOneAsync({ _id: 'root' })
    // 数据库为空代表首次访问，更新数据库
    if (data === undefined || _.isEmpty(data)) {
      data = await db.insertAsync({
        _id: 'root',
        attributes: { text: 'Home', note: '' },
        children: []
      })
    }
    commit('updateNode', data)
    return data
  },

  /**
   * 添加节点，同样会在其父节点的 node 属性中增加该新节点的 id
   * @param commit
   * @param parentid 父节点 id
   * @param previd 上一个节点 id，根据这个节点 id 选择插入位置
   * @returns {Promise<object>}
   */
  async addNode ({ commit, dispatch }, { parentid, previd }) {
    let parentNodeData = await db.findOneAsync({ _id: parentid })
    let newNodeData

    if (parentNodeData !== undefined && !_.isEmpty(parentNodeData)) {
      newNodeData = await dispatch('insertNode', { parentid })
      if (newNodeData !== undefined && !_.isEmpty(newNodeData)) {
        // 更新父节点
        if (previd) {
          const index = parentNodeData.children.indexOf(previd)
          parentNodeData.children.splice(index + 1, 0, newNodeData._id)
        } else {
          parentNodeData.children.push(newNodeData._id)
        }
        parentNodeData = await dispatch('updateNode', parentNodeData)
      }
    }

    return newNodeData
  },

  async deleteNode ({ commit, dispatch }, { parentid, _id }) {
    const numRemoved = await db.removeAsync({ _id: _id })
    const parentNodeData = await db.findOneAsync({ _id: parentid })

    // 更新父节点
    if (parentNodeData !== undefined && !_.isEmpty(parentNodeData)) {
      const index = parentNodeData.children.indexOf(_id)
      parentNodeData.children.splice(index, 1)
      await dispatch('updateNode', parentNodeData)
    }

    return numRemoved
  },

  /**
   * 插入空的新节点
   * @param commit
   * @param data
   * @returns {Promise<object>}
   */
  async insertNode ({ commit }, { parentid = '' }) {
    const newNodeData = await db.insertAsync({
      attributes: { text: '', note: '' },
      node: [],
      parentid: parentid
    })
    commit('insertNode', newNodeData)

    return newNodeData
  },

  /**
   * 和获取所有的节点数据
   * @param commit
   * @returns {Promise<object>}
   */
  async getAllNode ({ commit }) {
    const data = await db.findAsync({})
    commit('setAllNode', data)
    return data
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
    let parentNodeData = await db.findOneAsync({ _id: parentid })

    // 更新父节点
    if (parentNodeData !== undefined && !_.isEmpty(parentNodeData)) {
      const index = parentNodeData.children.indexOf(_id)
      parentNodeData.children.splice(index, 1)
      parentNodeData = await dispatch('updateNode', parentNodeData)
    }

    return parentNodeData
  },

  async addNodeChildren ({ commit, dispatch }, { _id, targetid }) {
    let targetNodeData = await db.findOneAsync({ _id: targetid })

    // 更新目标节点
    if (targetNodeData !== undefined && !_.isEmpty(targetNodeData)) {
      targetNodeData.children.push(_id)
      targetNodeData = await dispatch('updateNode', targetNodeData)
    }

    return targetNodeData
  }
}
