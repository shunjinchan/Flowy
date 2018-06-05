import _ from 'lodash'
import {
  getAllNode,
  getNode,
  deleteNode,
  deleteAllNode
} from '../../../services/nodeServices'
import {
  insertAsync,
  updateAsync,
  findOneAsync
} from '../../../services/dbServices'

export default {
  async getNode ({ commit, state }, { _id }) {
    const node = await getNode({ _id: _id })
    return node
  },

  async getAllNode ({ commit, state }) {
    const nodeList = await getAllNode()
    return nodeList
  },

  /**
   * 插入空的新节点，同时更新应用 state
   * @param commit
   * @param data
   * @returns {Promise<object>}
   */
  async insertNode ({ commit }, { parentid = '' }) {
    const newNode = await insertAsync({
      attributes: { text: '', note: '' },
      children: [],
      parentid: parentid
    })
    commit('insertNode', newNode)

    return newNode
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
    const numRemoved = await deleteNode({ _id: _id })
    const parentNode = await dispatch('getNode', { _id: parentid })

    // 更新父节点
    if (parentNode && !_.isEmpty(parentNode)) {
      const index = parentNode.children.indexOf(_id)
      parentNode.children.splice(index, 1)
      await dispatch('updateNode', parentNode)
    }

    return numRemoved
  },

  /**
   * 更新节点
   * @param commit
   * @param nodeData
   * @returns {Promise<object>}
   */
  async updateNode ({ commit }, nodeData) {
    const { affectedDocuments } = await updateAsync(
      { _id: nodeData._id },
      nodeData,
      { returnUpdatedDocs: true }
    )
    if (affectedDocuments && !_.isEmpty(affectedDocuments)) {
      commit('updateNode', affectedDocuments)
    }
    return affectedDocuments
  },

  /**
   * 懒更新节点数据，非响应式
   * @param commit
   * @param nodeData
   * @returns {Promise<object>}
   */
  async lazyupdateNode ({ commit }, nodeData) {
    const { affectedDocuments } = await updateAsync(
      { _id: nodeData._id },
      nodeData,
      { returnUpdatedDocs: true }
    )
    return affectedDocuments
  },

  async deleteNodeChildren ({ commit, dispatch }, { _id, targetid }) {
    let targetNode = await getNode({ _id: targetid })
    // 更新父节点
    if (targetNode && !_.isEmpty(targetNode)) {
      const index = targetNode.children.indexOf(_id)
      targetNode.children.splice(index, 1)
      targetNode = await dispatch('updateNode', targetNode)
    }
    return targetNode
  },

  async addNodeChildren ({ commit, dispatch }, { _id, targetid }) {
    let targetNode = await getNode({ _id: targetid })
    // 更新目标节点
    if (targetNode && !_.isEmpty(targetNode)) {
      targetNode.children.push(_id)
      targetNode = await dispatch('updateNode', targetNode)
    }
    return targetNode
  },

  async getRootNode ({ commit, dispatch, state }, { _id }) {
    let rootNode = await getNode({ _id: 'root' })

    if (!rootNode || _.isEmpty(rootNode)) {
      rootNode = await insertAsync({
        attributes: { text: 'Home', note: '' },
        children: [],
        parentid: '',
        _id: 'root'
      })
      commit('insertNode', rootNode)
    } else {
      let nodeList = await dispatch('getAllNode')
      nodeList.forEach(node => {
        if (node._id === _id) rootNode = node
      })
      commit('setAllNode', nodeList)
    }

    // 如果 rootNode 为空，重定向到首页
    if (_.isEmpty(rootNode)) {
      location.href = '/'
    } else {
      if (!rootNode.children || rootNode.children.length === 0) {
        await dispatch('addNode', { parentid: rootNode._id })
      }
    }

    return rootNode
  },

  /**
   * 清空所有节点，并执行一次初始化一次应用
   * @param commit
   * @returns {Promise<number>}
   */
  async emptyAllNode ({ commit, dispatch }) {
    const numRemoved = await deleteAllNode()
    // commit('emptyAllNode')
    // await dispatch('initRootNode')
    // await dispatch('addNode', { parentid: 'root' })
    return numRemoved
  }
}
