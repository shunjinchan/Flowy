const state = {
  textFieldFocus: false,
  noteFieldFocus: false
}

const mutations = {
  updateTextFieldFocusStatus (state, status) {
    state.textFieldFocus = status
  },
  updateNoteFieldFocusStatus (state, status) {
    state.noteFieldFocus = status
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
