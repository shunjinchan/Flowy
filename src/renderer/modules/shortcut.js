import { keypress } from 'keypress.js'
// import { keyboardShortcut } from '../config/keyboardShortcut'
import { getLastEditNode } from '@/modules/storage'

function handleKeydownTab (evt) {
  evt.preventDefault()

  if (!evt.shiftKey && this.$store.state.status.textFieldFocus) {
    this.$root.$emit('command:indentRight', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownShiftAndTab (evt) {
  evt.preventDefault()

  if (this.$store.state.status.textFieldFocus) {
    this.$root.$emit('command:indentLeft', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownShiftAndEnter (evt) {
  if (this.$store.state.status.textFieldFocus) {
    this.$root.$emit('command:addNodeNote', {
      evt,
      lastEditNode: getLastEditNode()
    })
    return
  }

  if (this.$store.state.status.noteFieldFocus) {
    this.$root.$emit('command:updateNodeNote', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownUp (evt) {
  if (!evt.altKey && this.$store.state.status.textFieldFocus) {
    this.$root.$emit('command:focusPrevNode', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownDown (evt) {
  if (!evt.altKey && this.$store.state.status.textFieldFocus) {
    this.$root.$emit('command:focusNextNode', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownAltAndUp (evt) {
  if (evt.altKey && this.$store.state.status.textFieldFocus) {
    this.$root.$emit('command:moveLineUp', {
      evt,
      lastEditNode: getLastEditNode()
    })
  }
}

function handleKeydownAltAndDown (evt) {
  if (evt.altKey && this.$store.state.status.textFieldFocus) {
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
        keys: 'tab',
        is_exclusive: false,
        on_keydown: handleKeydownTab.bind(context)
      },
      {
        keys: 'shift tab',
        is_exclusive: false,
        on_keydown: handleKeydownShiftAndTab.bind(context)
      },
      {
        keys: 'shift enter',
        is_exclusive: false,
        on_keydown: handleKeydownShiftAndEnter.bind(context)
      },
      {
        keys: 'up',
        is_exclusive: false,
        on_keydown: handleKeydownUp.bind(context)
      },
      {
        keys: 'down',
        is_exclusive: false,
        on_keydown: handleKeydownDown.bind(context)
      },
      {
        keys: 'alt up',
        is_exclusive: false,
        on_keydown: handleKeydownAltAndUp.bind(context)
      },
      {
        keys: 'alt down',
        is_exclusive: false,
        on_keydown: handleKeydownAltAndDown.bind(context)
      },
      {
        keys: 'shift alt up', // 向上选择节点
        is_exclusive: false
        // on_keydown: handleKeydownAltAndDown.bind(context)
      },
      {
        keys: 'shift alt down', // 向下选择节点
        is_exclusive: false
        // on_keydown: handleKeydownAltAndDown.bind(context)
      }
    ])
  },

  unRegister () {}
}
