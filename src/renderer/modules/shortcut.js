import { keypress } from 'keypress.js'
import { keyboardShortcut } from '../config/keyboardShortcut'

const keypressListener = new keypress.Listener()

export default {
  register (instance) {
    keypressListener.register_many([
      {
        keys: 'enter',
        is_exclusive: false,
        on_keydown (e) {
          // shift 非按下状态与 text filed 是聚焦状态
          if (!e.shiftKey && instance.$store.state.status.textFieldFocus) {
            instance.$root.$emit('command:addNode', e)
          }
        }
        // 'this': my_scope
      },
      {
        keys: 'shift enter',
        is_exclusive: false,
        on_keydown (e) {
          console.log(e)
          console.log('You pressed shift and enter.')
        }
      },
      {
        keys: 'tab',
        is_exclusive: false,
        on_keydown (e) {
          // shift 非按下状态与 text filed 是聚焦状态
          if (!e.shiftKey && instance.$store.state.status.textFieldFocus) {
            instance.$root.$emit('command:indentRight', e)
          }
        }
      },
      {
        keys: 'shift tab',
        is_exclusive: false,
        on_keydown (e) {
          if (e.shiftKey && instance.$store.state.status.textFieldFocus) {
            instance.$root.$emit('command:indentLeft', e)
          }
        }
      },
      {
        keys: 'backspace',
        is_exclusive: false,
        on_keydown (e) {
          // shift 非按下状态与 text filed 是聚焦状态
          if (instance.$store.state.status.textFieldFocus) {
            instance.$root.$emit('command:deleteNode', e)
          }
        }
      }
    ])
  },
  unRegister () {}
}
