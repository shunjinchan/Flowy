<template>
    <div class="text-field"
         :contenteditable="editable"
         v-html="text"
         @click="handleClick"
         @keypress.enter.prevent="handleKeypress">
    </div>
</template>

<script>
  export default {
    name: 'text-field',
    data () {
      return {
        editable: false
      }
    },
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    methods: {
      enableEditable () {
        this.editable = true
      },
      disableEditable () {
        this.editable = false
      },
      handleClick () {
        this.enableEditable()
      },
      handleKeypress (evt) {
        this.disableEditable()
        this.$emit('updateOutlineText', evt.target.textContent)
      }
    }
  }
</script>

<style scoped>

</style>