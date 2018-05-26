import Vue from 'vue'

export default {
  /**
   * 更新所有节点数据，一般在页面初始化时使用
   * @param state
   * @param data
   */
  setAllOutline (state, data) {
    data.forEach(item => {
      Vue.set(state, item._id, item)
    })
  },

  insertOutline (state, data) {
    Vue.set(state, data._id, data)
  },

  /**
   * 更新节点数据
   * @param state
   * @param data
   */
  updateOutline (state, data) {
    state[data._id] = data
  },

  // // 子节点也要移动
  // moveOutline (state, data) {},
  //
  // // 子节点也要删除
  // deleteOutline (sate, data) {},
  //
  // // 子节点也要更新
  // completeOutline (state, data) {},
  //
  // // 子节点也要复制
  // duplicateOutline (state, data) {},

  /**
   * 清空所有节点数据
   * @param state
   */
  emptyAllOutline (state) {
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        if (key !== 'root') state[key] = null
      }
    }
  }
}
