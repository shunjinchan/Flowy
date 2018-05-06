import shortid from 'shortid'
import db from '../../datastore'

// 应用初始状态，只有在没有录入任何内容的时候才使用该属性
// 当有录入内容时，就从数据库里读取
const initState = {
  root: {
    id: 'root',
    attributes: {
      text: 'Home',
      note: '根路径'
    },
    outline: []
  }
}

db.find({ id: 'root' }, (err, docs) => {
  if (err) throw err
  if (docs.length === 0) {}
})

const state = initState

const mutations = {
  // TODO: 新增节点时要根据位置灵活插入到下一个节点，而不是丢在最后一个节点
  addOutline (state, data) {
    const uuid = shortid.generate()
    state[data.id].outline.push(uuid)
    state[uuid] = {
      id: uuid,
      attributes: {
        text: '',
        note: ''
      },
      outline: []
    }
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
    state[data.id].attributes.text = data.text
  },
  addOutlineNote (state, data) {},
  updateOutlineNote (state, data) {}
}

export default {
  state,
  mutations
}
