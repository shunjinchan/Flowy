import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import {
  getAllNode,
  getNode,
  deleteNode,
  deleteAllNode
} from '../../../services/nodeServices'
import {
  insertAsync,
  updateAsync
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
   * @param nodeData
   * @returns {Promise<object>}
   */
  async addNode ({ commit }, nodeData) {
    const newNode = await insertAsync(nodeData)
    return newNode
  },

  async deleteNode ({ commit, dispatch }, _ids) {
    if (typeof _ids === 'string') {
      const numRemoved = await deleteNode({ _id: _ids })
      return numRemoved
    }

    if (Array.isArray(_ids)) {
      _ids.forEach(_id => {})
    }
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

    return affectedDocuments
  },

  async getRootNode ({ commit, dispatch, state }, { _id }) {
    let rootNode = await getNode({ _id: 'root' })

    let getAllNode = async () => {
      let nodeList = await dispatch('getAllNode')
      nodeList.forEach(node => {
        if (node._id === _id) rootNode = node
      })
      commit('setAllNode', nodeList)
    }

    let addRootChild = async () => {
      const _id = uuidv4()
      const newNode = {
        attributes: { text: '', note: '', isExpanded: true },
        children: [],
        parentid: rootNode._id,
        _id: _id
      }
      const newRootNode = _.cloneDeep(rootNode)

      newRootNode.children.push(_id)
      commit('addNode', newNode)
      commit('updateNode', newRootNode)
      await dispatch('addNode', newNode)
      await dispatch('updateNode', newRootNode)
    }

    let addRootNode = async () => {
      rootNode = {
        attributes: { text: 'Home', note: '', isExpanded: true },
        children: [],
        parentid: '',
        _id: 'root'
      }
      commit('addNode', rootNode)
      await dispatch('addNode', rootNode)
      addRootChild()
    }

    if (!rootNode || _.isEmpty(rootNode)) {
      addRootNode()
    } else {
      getAllNode()
    }

    // 如果 rootNode 为空，重定向到首页
    if (_.isEmpty(rootNode)) {
      location.href = '/'
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
    commit('emptyAllNode')
    return numRemoved
  }
}
