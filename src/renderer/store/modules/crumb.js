const state = {
  current: 'root'
}

const mutations = {
  updateCrumb (state, _id) {
    state.current = _id
  },
  emptyCrumb (state) {
    state.current = 'root'
  }
}

export default {
  state,
  mutations
}
