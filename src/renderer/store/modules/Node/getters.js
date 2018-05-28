export default {
  getNode: (state) => {
    return (id) => {
      return state[id]
    }
  },

  currentNodeid (state) {
    return state.currentNodeid
  }
}
