export default {
  getNode: (state) => {
    return (_id) => {
      return state[_id]
    }
  },

  lastEditNode (state) {
    return state.lastEditNode
  }
}
