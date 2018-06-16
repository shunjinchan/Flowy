import { keypress } from 'keypress.js'
// import { keyboardShortcut } from '../config/keyboardShortcut'
import { detectKey, convertKeyName } from '@/modules/keyboard'
import { getLastEditNode } from '@/modules/storage'

const tab = 'tab'
const shiftTab = 'shift tab'
const shiftEnter = 'shift enter'
const up = 'up'
const down = 'down'
const cmdUp = 'cmd up'
const cmdDown = 'cmd down'

function convertKeydownEvent (evt) {
  return {
    keyName: convertKeyName(evt),
    keyCode: evt.keyCode,
    cmdKey: evt.metaKey,
    shiftKey: evt.shiftKey,
    ctrlKey: evt.ctrlKey,
    altKey: evt.altKey,
    innerHTML: evt.target.innerHTML,
    evt: evt
  }
}

function handleKeydownTab (keys, evt) {
  evt.preventDefault()

  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.textFieldFocus
  ) {
    this.$root.$emit('command:indentRight', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownShiftTab (keys, evt) {
  evt.preventDefault()

  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.textFieldFocus
  ) {
    this.$root.$emit('command:indentLeft', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownShiftEnter (keys, evt) {
  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.textFieldFocus
  ) {
    this.$root.$emit('command:addNodeNote', {
      evt,
      lastEditNode: getLastEditNode()
    })
    return
  }

  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.noteFieldFocus
  ) {
    this.$root.$emit('command:updateNodeNote', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownUp (keys, evt) {
  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.textFieldFocus
  ) {
    this.$root.$emit('command:focusPrevNode', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownDown (keys, evt) {
  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.textFieldFocus
  ) {
    this.$root.$emit('command:focusNextNode', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownCmdUp (keys, evt) {
  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.textFieldFocus
  ) {
    this.$root.$emit('command:moveLineUp', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownCmdDown (keys, evt) {
  if (
    detectKey(keys, convertKeydownEvent(evt)) &&
    this.$store.state.status.textFieldFocus
  ) {
    this.$root.$emit('command:moveLineDown', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

export default {
  /**
   * 注册快捷键
   * @param {Vue} context Vue 实例
   */
  register (context) {
    if (this.keypressListener) return

    this.keypressListener = new keypress.Listener()
    this.keypressListener.register_many([
      {
        keys: tab,
        is_exclusive: false,
        on_keydown: handleKeydownTab.bind(context, tab)
      },
      {
        keys: shiftTab,
        is_exclusive: false,
        on_keydown: handleKeydownShiftTab.bind(context, shiftTab)
      },
      {
        keys: shiftEnter,
        is_exclusive: false,
        on_keydown: handleKeydownShiftEnter.bind(context, shiftEnter)
      },
      {
        keys: up,
        is_exclusive: false,
        on_keydown: handleKeydownUp.bind(context, up)
      },
      {
        keys: down,
        is_exclusive: false,
        on_keydown: handleKeydownDown.bind(context, down)
      },
      {
        keys: cmdUp,
        is_exclusive: false,
        is_unordered: true,
        on_keydown: handleKeydownCmdUp.bind(context, cmdUp)
      },
      {
        keys: cmdDown,
        is_exclusive: false,
        is_unordered: true,
        on_keydown: handleKeydownCmdDown.bind(context, cmdDown)
      }
      // {
      //   keys: 'shift cmd up', // 向上选择节点
      //   is_exclusive: false
      //   // on_keydown: handleKeydownAltAndDown.bind(context)
      // },
      // {
      //   keys: 'shift cmd down', // 向下选择节点
      //   is_exclusive: false
      //   // on_keydown: handleKeydownAltAndDown.bind(context)
      // }
    ])
  },

  unRegister () {}
}
