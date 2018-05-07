import _ from 'lodash'
import db from '../../datastore'

// 应用初始状态，只有在没有录入任何内容的时候才使用该属性
// 当有录入内容时，就从数据库里读取
const rootState = {
  _id: 'root',
  attributes: {
    text: 'Home',
    note: ''
  },
  outline: []
}
const initState = {
  root: rootState
}

const state = initState

const mutations = {
  /**
   * 更新根节点
   * @param state
   * @param docs 新的节点数据
   */
  updateRootNode (state, docs) {
    state.root = docs
  },
  /**
   * 添加节点
   * @param state
   * @param docs 新的节点数据
   */
  addOutline (state, docs) {
    state[docs._id] = docs
  },
  // 子节点也要移动
  moveOutline (state, data) {},
  // 子节点也要删除
  deleteOutline (sate, data) {},
  // 子节点也要更新
  completeOutline (state, data) {},
  // 子节点也要复制
  duplicateOutline (state, date) {},
  updateOutlineText (state, data) {
    state[data._id].attributes.text = data.text
  },
  addOutlineNote (state, data) {},
  updateOutlineNote (state, data) {},
  emptyAllOutline () {}
}

const actions = {
  /**
   * 获取 Root 节点数据
   * @param commit
   * @returns {Promise<void>}
   */
  async getRootNode ({ commit }) {
    const docs = await db.findOneAsync({ _id: 'root' })
    if (_.isEmpty(docs)) {
      db.insert(rootState)
    } else {
      commit('updateRootNode', docs)
    }
  },
  /**
   * 添加大纲节点
   * @param commit
   * @param parentid 父节点 id
   * @param previd 上一个节点 id，根据这个节点 id 选择插入位置
   * @returns {Promise<void>}
   */
  async addOutline ({ commit }, { parentid, previd }) {
    const parentDocs = await db.findOneAsync({ _id: parentid })

    if (parentDocs) {
      const docs = await db.insertAsync({
        attributes: {
          text: '',
          note: ''
        },
        outline: []
      })

      // 更新父节点的 outline 数组
      parentDocs.outline.push(docs.id)
      const numReplaced = await db.updateAsync(
        { _id: parentid },
        { outline: parentDocs.outline }
      )

      if (numReplaced === 1) {
        commit('addOutline', docs)
        commit('updateRootNode', parentDocs)
      }
    }
  },
  async updateOutline ({ commit }) {},
  /**
   * 清空所有节点
   * @param commit
   * @returns {Promise<void>}
   */
  async emptyAllOutline ({ commit }) {
    const numRemoved = await db.remove({}, { multi: true })
    numRemoved && commit('emptyAllOutline')
  },
  updateOutlineText () {}
}

export default {
  state,
  mutations,
  actions
}
