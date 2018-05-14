import Vue from 'vue'
import _ from 'lodash'
import db from '../../datastore'

const rootState = {
  _id: 'root',
  attributes: {
    text: 'Home',
    note: ''
  },
  outline: []
}

const state = {
  root: rootState
}

const getters = {
  getRoot: state => state.root
}

const mutations = {
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
    for (let key in state) {
      key === 'root' ? state.root = rootState : state.key = null
    }
  }
}

const actions = {
  /**
   * 初始化根节点
   * @param commit
   * @returns {Promise<object>}
   */
  async initRootOutline ({ commit }) {
    let data = await db.findOneAsync({ _id: 'root' })
    // 数据库为空代表首次访问，更新数据库
    if (_.isEmpty(data)) {
      data = await db.insertAsync(state.root)
    }
    commit('updateOutline', data)
    return data
  },

  /**
   * 添加节点，同样会在其父节点的 outline 属性中增加该新节点的 id
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
      const newOutlineData = await dispatch('insertOutline')
      // 更新父节点
      if (previd) {
        const index = parentOutlineData.outline.indexOf(previd)
        parentOutlineData.outline.splice(index + 1, 0, newOutlineData._id)
      } else {
        parentOutlineData.outline.push(newOutlineData._id)
      }
      await dispatch('updateOutline', parentOutlineData)
      return newOutlineData
    }
    return null
  },

  async deleteOutline ({ commit, dispatch }, { parentid, _id }) {
    const parentOutlineData = await db.findOneAsync({ _id: parentid })
    // 移除节点
    const numRemoved = await db.removeAsync({ _id: _id })
    // 更新父节点
    if (parentOutlineData) {
      const index = parentOutlineData.outline.indexOf(_id)
      parentOutlineData.outline.splice(index, 1)
      await dispatch('updateOutline', parentOutlineData)
    }
    return numRemoved
  },

  /**
   * 插入空的新节点
   * @param commit
   * @param data
   * @returns {Promise<object>}
   */
  async insertOutline ({ commit }) {
    const newOutlineData = await db.insertAsync({
      attributes: { text: '', note: '' },
      outline: []
    })
    commit('updateOutline', newOutlineData)
    return newOutlineData
  },

  /**
   * 和获取所有的节点数据
   * @param commit
   * @returns {Promise<object>}
   */
  async getAllOutline ({ commit }) {
    const data = await db.findAsync({})
    commit('setAllOutline', data)
    return data
  },

  /**
   * 清空所有节点，并执行一次初始化一次应用
   * @param commit
   * @returns {Promise<number>}
   */
  async emptyAllOutline ({ commit, dispatch }) {
    const numRemoved = await db.removeAsync({}, { multi: true })
    commit('emptyAllOutline')
    await dispatch('initRootOutline')
    await dispatch('addOutline', {
      parentid: 'root'
    })
    return numRemoved
  },

  /**
   * 更新节点
   * @param commit
   * @param outlineData
   * @returns {Promise<object>}
   */
  async updateOutline ({ commit }, outlineData) {
    const { affectedDocuments } = await db.updateAsync(
      { _id: outlineData._id },
      outlineData,
      { returnUpdatedDocs: true }
    )
    commit('updateOutline', affectedDocuments)
    return affectedDocuments
  },

  async deleteOutlineChildren ({ commit, dispatch }, { _id, parentid }) {
    let parentOutlineData = await db.findOneAsync({ _id: parentid })
    // 更新父节点
    if (parentOutlineData) {
      const index = parentOutlineData.outline.indexOf(_id)
      parentOutlineData.outline.splice(index, 1)
      parentOutlineData = await dispatch('updateOutline', parentOutlineData)
    }
    return parentOutlineData
  },

  async addOutlineChildren ({ commit, dispatch }, { _id, targetid }) {
    let targetOutlineData = await db.findOneAsync({ _id: targetid })
    // 更新父节点
    if (targetOutlineData) {
      targetOutlineData.outline.push(_id)
      targetOutlineData = await dispatch('updateOutline', targetOutlineData)
    }
    return targetOutlineData
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
