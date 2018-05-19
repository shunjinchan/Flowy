<template>
    <div class="text-field"
         contenteditable
         ref="input"
         v-text="text"
         @click="handleClick"
         @input="handleInput"
         @keypress.enter.prevent="handleKeypressEnter"
         @keydown.delete="handleKeydownDelete"
         @keydown.tab.prevent="handleKeydownTab" 
         @focus="handleFocus">
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
      }
    },

    mounted () {
      this.focus()
      this.collapseToEnd()
    }
  }
</script>

<style lang="scss" scoped>

</style>
