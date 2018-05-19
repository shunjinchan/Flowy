export default {
  getOutline: (state) => {
    return (id) => {
      return state[id]
    }
  },

  currentOutlineid (state) {
    return state.currentOutlineid
  }
}
