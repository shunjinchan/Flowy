import { keypress } from 'keypress.js'
import { keyboardShortcut } from '../config/keyboardShortcut'
import { getLastEditNode } from '@/modules/storage'

const keypressListener = new keypress.Listener()

export default {
  /**
   * 注册快捷键
   * @param {Vue} context Vue 实例
   */
  register (context) {
    keypressListener.register_many([
      {
        keys: 'tab',
        is_exclusive: false,
        on_keydown (evt) {
          if (!evt.shiftKey && context.$store.state.status.textFieldFocus) {
            context.$root.$emit('command:indentRight', {
              evt,
              lastEditNode: getLastEditNode()
            })
          }
        },
        prevent_default: true
      },
      {
        keys: 'shift tab',
        is_exclusive: false,
        on_keydown (evt) {
          if (evt.shiftKey && context.$store.state.status.textFieldFocus) {
            context.$root.$emit('command:indentLeft', {
              evt,
              lastEditNode: getLastEditNode()
            })
          }
        },
        prevent_default: true
      }
    ])
  },
  unRegister () {}
}
