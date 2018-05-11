<template>
    <div class="text-field"
         ref="input"
         v-text="text"
         :contenteditable="editable"
         @click="handleClick"
         @keypress.enter.prevent="handleKeypressEnter"
         @keyup.delete.prevent="handleKeyupDelete">
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
      handleKeypressEnter (evt) {
        this.disableEditable()
        this.$emit('updateOutlineText', evt.target.textContent)
        this.$emit('addOutline')
      },
      handleKeyupDelete (evt) {
        if (evt.target.textContent === '') {
          this.$emit('updateOutlineText', evt.target.textContent)
        }
      }
    }
  }
</script>

<style scoped>

</style>