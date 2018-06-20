const state = {
  list: [],
  selectionMode: false,
  direction: '',
  lastNodeid: ''
}

const mutations = {
  addSelctionNode (state, _id) {
    !state.list.some(item => item === _id) && state.list.push(_id)
  },

  removeSelectionNode (state, _id) {
    state.list.pop()
    state.lastNodeid = state.list[state.list.length - 1]
  },

  clearSelectionNode (state, _id) {
    state.list = []
    state.direction = ''
  },

  updateSelectionDirection (state, direction) {
    state.direction = direction
  }
}

const getters = {
  selectionMode () {
    return state.list.length > 0
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions,
  getters
}
