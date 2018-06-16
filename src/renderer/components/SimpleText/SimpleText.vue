<template>
  <div class="simple-text">
    <div class="input"
        contenteditable
        ref="input"
        v-html="text"
        @blur="handleBlur"
        @click="handleClick"
        @focus="handleFocus" >
    </div>
  </div>
</template>

<script>
import { debounceTime, map, filter } from 'rxjs/operators'
import { convertKeyName } from '@/modules/keyboard'
import { shortcut } from './shortcut'

export default {
  name: 'simple-text',

  props: {
    text: {
      type: String,
      default: ''
    },
    isFocus: {
      type: Boolean,
      default: false
    },
    handleClick: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    handleInput: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    handleFocus: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    handleBlur: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    handleKeydownEnter: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    handleKeydownDelete: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    }
  },

  watch: {
    isFocus () {
      if (this.isFocus) {
        this.focus()
        this.collapseToEnd()
      }
    }
  },

  methods: {
    collapseToEnd () {
      const selection = getSelection()
      selection.selectAllChildren(this.$refs.input)
      selection.collapseToEnd()
    },

    focus () {
      this.$refs.input.focus()
    },

    format (command, value = null) {
      document.execCommand(command, false, value)
    },

    handleKeydownMetaAndB (evt) {
      evt.preventDefault()
      this.format('bold')
    },

    handleKeydownMetaAndU (evt) {
      evt.preventDefault()
      this.format('underline')
    },

    handleKeydownMetaAndI (evt) {
      evt.preventDefault()
      this.format('italic')
    },

    handleKeydownShiftAndMetaAndB (evt) {
      evt.preventDefault()
      this.format('formatblock', 'blockquote')
    },

    observeInputs () {
      const inputs = this.$fromDOMEvent('.input', 'input')
      inputs.pipe(
        debounceTime(500),
        map(evt => evt.target.innerHTML)
      ).subscribe(text => {
        this.handleInput(text)
      })
    },

    observeKeydowns () {
      const keydowns = this.$fromDOMEvent('.input', 'keydown')

      const filterKeydowns = (evt) => {
        const currentKeyName = evt.key.toLowerCase()
        const whileList = ['enter', 'delete', 'backspace', 'b', 'u', 'i']
        return whileList.some((key) => key === currentKeyName)
      }

      const mapKeydowns = (evt) => {
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

      const subscribeKeydowns = (data) => {
        shortcut.call(this, data)
      }

      keydowns.pipe(
        filter(filterKeydowns),
        map(mapKeydowns)
      ).subscribe(subscribeKeydowns)
    },

    observe () {
      this.observeInputs()
      this.observeKeydowns()
    }
  },

  mounted () {
    this.observe()
    if (this.isFocus) {
      this.focus()
      this.collapseToEnd()
    }
  },

  updated () {
    if (this.isFocus) {
      this.focus()
      this.collapseToEnd()
    }
  }
}
</script>

