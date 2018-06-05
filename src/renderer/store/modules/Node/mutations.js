import Vue from 'vue'
import { setLastEditNode } from '@/modules/storage'

export default {
  /**
   * 更新所有节点数据，一般在页面初始化时使用
   * @param state
   * @param data
   */
  setAllNode (state, data) {
    data.forEach(item => {
      Vue.set(state, item._id, item)
    })
  },

  insertNode (state, data) {
    Vue.set(state, data._id, data)
  },

  /**
   * 更新节点数据
   * @param state
   * @param data
   */
  updateNode (state, data) {
    state[data._id] = data
  },

  // // 子节点也要移动
  // moveNode (state, data) {},
  //
  // // 子节点也要删除
  // deleteNode (sate, data) {},
  //
  // // 子节点也要更新
  // completeNode (state, data) {},
  //
  // // 子节点也要复制
  // duplicateNode (state, data) {},

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
