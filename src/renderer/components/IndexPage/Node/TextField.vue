<template>
    <div class="text-field"
         ref="input"
         v-text="text"
         :contenteditable="editable"
         @click="handleClick"
         @input="handleInput"
         @keypress.enter.prevent="handleKeypressEnter"
         @keyup.delete.prevent="handleKeyupDelete">
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
      editable: {
        type: Boolean,
        default: false
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
      handleKeyupDelete: {
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
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
