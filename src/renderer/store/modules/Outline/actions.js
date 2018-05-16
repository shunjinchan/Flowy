import _ from 'lodash'
import db from '@/datastore'

export default {
  /**
   * 初始化根节点
   * @param commit
   * @returns {Promise<object>}
   */
  async initRootOutline ({ commit, state }) {
    let data = await db.findOneAsync({ _id: 'root' })
    // 数据库为空代表首次访问，更新数据库
    if (_.isEmpty(data)) data = await db.insertAsync(state.root)
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

    if (parentOutlineData) {
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
    commit('insertOutline', newOutlineData)
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
    await dispatch('addOutline', { parentid: 'root' })

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

  /**
   * 懒更新节点数据，非响应式
   * @param commit
   * @param outlineData
   * @returns {Promise<object>}
   */
  async lazyUpdateOutline ({ commit }, outlineData) {
    const { affectedDocuments } = await db.updateAsync(
      { _id: outlineData._id },
      outlineData,
      { returnUpdatedDocs: true }
    )
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
