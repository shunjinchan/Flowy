import Vue from 'vue'
// import _ from 'lodash'
import { setLastEditNode } from '@/modules/storage'

export default {
  /**
   * 更新所有节点数据，一般在页面初始化时使用
   * @param state
   * @param nodes
   */
  setAllNode (state, nodes) {
    nodes.forEach(item => {
      Vue.set(state, item._id, item)
    })
  },

  addNode (state, node) {
    Vue.set(state, node._id, node)
  },

  /**
   * 更新节点数据
   * @param state
   * @param node
   */
  updateNode (state, node) {
    state[node._id] = node
  },

  deleteNode (state, _ids) {
    if (typeof _ids === 'string') {
      delete state[_ids]
      return
    }

    if (Array.isArray(_ids)) {
      _ids.forEach(_id => {
        delete state[_id]
      })
    }
  },

  /**
   * 清空所有节点数据
   * @param state
   */
  emptyAllNode (state) {
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        if (key !== 'root') state[key] = null
      }
    }
  },

  updateLastEditNode (state, _id) {
    state.lastEditNode = _id
    setLastEditNode(_id)
  }
}
