import { keypress } from 'keypress.js'
import { keyboardShortcut } from '../config/keyboard.shortcut'

const keypressListener = new keypress.Listener()

export default {
  register () {
    keypressListener.register_many([
      {
        'keys': 'enter',
        'is_exclusive': true,
        'on_keydown': function (e) {
          console.log(e)
          console.log('You pressed enter.')
        }
        // 'this': my_scope
      },
      {
        'keys': 'shift enter',
        'is_exclusive': true,
        'on_keydown': function (e) {
          console.log(e)
          console.log('You pressed shift and enter.')
        }
        // 'this': my_scope
      }
    ])
  },
  unRegister () {}
}
