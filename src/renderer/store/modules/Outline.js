import _ from 'lodash'
import db from '../../datastore'

const state = {
  root: {
    _id: 'root',
    attributes: {
      text: 'Home',
      note: ''
    },
    outline: []
  }
}

const getters = {
  root: state => state.root
}

const mutations = {
  /**
   * 更新所有节点数据，一般在页面初始化时使用
   * @param state
   * @param data
   */
  setAllOutline (state, data) {
    data.forEach(item => {
      state[item._id] = item
    })
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
  // duplicateOutline (state, date) {},

  /**
   * 清空所有节点数据
   * @param state
   */
  emptyAllOutline (state) {
    state = {}
  }
}

const actions = {
  async insertRootOutline ({ commit }) {
    let data = await db.findOneAsync({ _id: 'root' })
    // 数据库为空代表首次访问，更新数据库
    if (_.isEmpty(data)) {
      data = await db.insertAsync(state.root)
    }
    commit('updateOutline', data)
    return data
  },

  /**
   * 添加大纲节点
   * @param commit
   * @param parentid 父节点 id
   * @param previd 上一个节点 id，根据这个节点 id 选择插入位置
   * @returns {Promise<object>}
   */
  async addOutline ({ commit, dispatch }, { parentid, previd }) {
    const parentOutlineData = await db.findOneAsync({ _id: parentid })

    // 父节点不为空
    if (parentOutlineData) {
      // 新增空节点
      const newOutlineData = await db.insertAsync({
        attributes: { text: '', note: '' },
        outline: []
      })
      debugger
      commit('updateOutline', newOutlineData)
      // 更新父节点
      parentOutlineData.outline.push(newOutlineData._id)
      debugger
      await dispatch('updateOutline', {
        outlineData: parentOutlineData
      })
      return newOutlineData
    }
    return null
  },

  /**
   * 和获取所有的节点数据
   * @param commit
   * @returns {Promise<*>}
   */
  async getAllOutline ({ commit }) {
    const data = await db.findAsync({})
    commit('setAllOutline', data)
    return data
  },

  /**
   * 清空所有节点
   * @param commit
   * @returns {Promise<void>}
   */
  async emptyAllOutline ({ commit }) {
    const numRemoved = await db.remove({}, { multi: true })
    commit('emptyAllOutline')
    return numRemoved
  },

  /**
   * 更新节点
   * @param commit
   * @param outlineData
   * @returns {Promise<object>}
   */
  async updateOutline ({ commit }, { outlineData }) {
    const { affectedDocuments } = await db.updateAsync(
      { _id: outlineData._id },
      outlineData,
      { returnUpdatedDocs: true }
    )
    debugger
    commit('updateOutline', affectedDocuments)
    return affectedDocuments
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
