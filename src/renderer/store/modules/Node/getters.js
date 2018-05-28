export default {
  getNode: (state) => {
    return (_id) => {
      return state[_id]
    }
  },

  currentNodeid (state) {
    return state.currentNodeid
  }
}
