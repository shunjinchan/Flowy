const state = {
  textFieldFocus: false,
  noteFieldFocus: false
}

const mutations = {
  updateTextFieldFocusStatus ({ status }) {
    state.textFieldFocus = status
  },
  updateNoteFieldFocusStatus ({ status }) {
    state.noteFieldFocus = status
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
