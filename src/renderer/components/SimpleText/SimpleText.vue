<template>
  <div class="text-field">
    <div class="input"
        contenteditable
        ref="input"
        v-text="text"
        @blur="handleBlur"
        @click="handleClick"
        @focus="handleFocus"
        @keydown.enter.prevent="handleKeydownEnter"
        @keydown.delete="handleKeydownDelete" >
    </div>
  </div>
</template>

<script>
import { debounceTime, map } from 'rxjs/operators'
export default {
  name: 'text-field',

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
    },
    handleKeydownTab: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    }
  },

  watch: {
    isFocus () {
      this.isFocus && this.focus()
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
      this.collapseToEnd()
    },

    observeInputs () {
      const inputs = this.$fromDOMEvent('.input', 'input')
      inputs.pipe(
        debounceTime(500),
        map(e => e.target.textContent)
      ).subscribe(text => {
        this.handleInput(text)
      })
    },

    observe () {
      this.observeInputs()
    }
  },

  mounted () {
    this.observe()
    this.isFocus && this.focus()
  }
}
</script>
