<template>
  <div class="simple-text">
    <div class="input"
        contenteditable
        ref="input"
        v-text="text"
        @blur="handleBlur"
        @click="handleClick"
        @focus="handleFocus" >
    </div>
  </div>
</template>

<script>
import { debounceTime, map, filter } from 'rxjs/operators'
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
        map(evt => evt.target.textContent)
      ).subscribe(text => {
        this.handleInput(text)
      })
    },

    observeKeydowns () {
      const keydowns = this.$fromDOMEvent('.input', 'keydown')
      const filterKeydowns = (evt) => {
        console.log(evt.keyCode)
        return (
          evt.keyCode === 13 || // enter
          evt.keyCode === 8 // delete/backspace
          // evt.keyCode === 9 || // tab
          // evt.keyCode === 38 || // arrow up
          // evt.keyCode === 40 || // arrow down
          // evt.keyCode === 37 || // arrow left
          // evt.keyCode === 39 || // arrow right
          // evt.keyCode === 188 || // lt
          // evt.keyCode === 190 || // gt
          // evt.keyCode === 16 || // shift[shiftKey]
          // evt.keyCode === 17 || // ctrl[ctrlKey]
          // evt.keyCode === 18 || // alt[altKey]
          // evt.keyCode === 91 // meta[metaKey]，Mac 对应 command，Windows 徽标键 (⊞)
        )
      }
      const mapKeydowns = (evt) => {
        return {
          keyCode: evt.keyCode,
          metaKey: evt.metaKey,
          shiftKey: evt.shiftKey,
          ctrlKey: evt.ctrlKey,
          altKey: evt.altKey,
          textContent: evt.target.textContent,
          event: evt
        }
      }
      const subscribeKeydowns = (data) => {
        // on keydown enter，过滤系统修饰键
        if (
          data.keyCode === 13 &&
          data.metaKey === false &&
          data.shiftKey === false &&
          data.ctrlKey === false &&
          data.altKey === false
        ) {
          this.handleKeydownEnter(data.event)
        }

        // on keydown backspace/delete
        if (
          data.keyCode === 8 &&
          data.metaKey === false &&
          data.shiftKey === false &&
          data.ctrlKey === false &&
          data.altKey === false
        ) {
          this.handleKeydownDelete(data.event)
        }
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
    this.isFocus && this.focus()
  },

  updated () {
    this.isFocus && this.focus()
  }
}
</script>
