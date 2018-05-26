<template>
  <div class="text-field">
    <div class="input"
        contenteditable
        ref="input"
        v-text="text"
        @click="handleClick"
        @keypress.enter.prevent="handleKeypressEnter"
        @keydown.delete="handleKeydownDelete"
        @keydown.tab.prevent="handleKeydownTab" 
        @focus="handleFocus">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'text-field',

    props: {
      text: {
        type: String,
        default: ''
      },
      handleKeypressEnter: {
        type: Function,
        default () {
          return () => {}
        },
        require: false
      },
      handleClick: {
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
      observe () {
        this.$fromDOMEvent('.input', 'input')
          .debounceTime(500)
          .map(e => e.target.textContent)
          .subscribe(text => {
            this.handleInput(text)
          })
      }
    },

    mounted () {
      this.observe()
      this.focus()
      this.collapseToEnd()
    }
  }
</script>

<style lang="scss" scoped>
.text-field {
  .input {
    outline: none;
  }
}
</style>
