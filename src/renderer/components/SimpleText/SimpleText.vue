<template>
  <div class="text-field">
    <div class="input"
        contenteditable
        ref="input"
        v-text="text"
        @blur="handleBlur"
        @click="handleClick"
        @focus="handleFocus"
        @keydown.delete="handleKeydownDelete"
        @keydown.tab.prevent="handleKeydownTab"
        @keydown.shift.tab.prevent="handleKeydownShiftAndTab"
        @keydown.shift.enter.prevent="handleKeydownShiftAndEnter" >
    </div>
  </div>
</template>

<script>
import { debounceTime, map, filter } from 'rxjs/operators'
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
    },
    handleKeydownShiftAndTab: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    },
    handleKeydownShiftAndEnter: {
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

    observeKeydowns () {
      const keydowns = this.$fromDOMEvent('.input', 'keydown')
      const filterKeyCode = (e) => {
        console.log(e.keyCode)
        return (
          e.keyCode === 13 || // enter
          e.keyCode === 9 || // tab
          e.keyCode === 8 || // delete
          e.keyCode === 18 || // alt
          e.keyCode === 91 || // meta，Mac 对应 command，Windows 徽标键 (⊞)
          e.keyCode === 38 || // arrow up
          e.keyCode === 40 || // arrow down
          e.keyCode === 37 || // arrow left
          e.keyCode === 39 || // arrow right
          e.keyCode === 188 || // lt
          e.keyCode === 190 || // gt
          e.keyCode === 16 // shift
        )
      }

      keydowns.pipe(
        filter(filterKeyCode),
        map(e => {
          return {
            keyCode: e.keyCode,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            textContent: e.target.textContent
          }
        })
      ).subscribe(data => {
        // on keydown enter
        if (data.keyCode === 13 && data.shiftKey === false) {
          this.handleKeydownEnter(data.textContent)
          return
        }
        // on keydown shift and enter
        if (data.keyCode === 13 && data.shiftKey === true) {
          this.handleKeydownShiftAndEnter(data.textContent)
        }
      })
    },

    observe () {
      this.observeInputs()
      this.observeKeydowns()
    }
  },

  mounted () {
    this.observe()
    this.isFocus && this.focus()
  }
}
</script>
