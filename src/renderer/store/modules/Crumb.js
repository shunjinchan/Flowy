const state = {
  current: 'root'
}

const mutations = {
  updateCrumb (state, _id) {
    state.current = _id
  }
}

const actions = {
  updateCrumb ({ commit }, _id) {
    commit('updateCrumb', _id)
  }
}

export default {
  state,
  mutations,
  actions
}
