import { getLastEditNode, setLastEditNode } from '@/modules/storage'

const state = {
  isTextFieldFocus: false,
  isNoteFieldFocus: false,
  lastEditNode: getLastEditNode() || 'root',
  dragMode: {
    status: false,
    _id: ''
  }
}

const mutations = {
  updateTextFieldFocusStatus (state, status) {
    state.isTextFieldFocus = status
  },

  updateNoteFieldFocusStatus (state, status) {
    state.isNoteFieldFocus = status
  },

  updateLastEditNode (state, _id) {
    state.lastEditNode = _id
    setLastEditNode(_id)
  },

  updatedragMode (state, { status, _id }) {
    state.dragMode.status = status
    state.dragMode._id = _id
  }
}

const actions = {}

const getters = {
  lastEditNode (state) {
    return state.lastEditNode
  },

  dragMode (state) {
    return state.dragMode
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
