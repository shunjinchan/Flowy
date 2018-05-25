<template>
    <div class="command-container">
      <button @click="emptyAllOutline">{{ text }}</button>
    </div>
</template>

<script>
export default {
  name: 'command-container',
  data () {
    return {
      text: '清空'
    }
  },
  methods: {
    emptyAllOutline () {
      this.$store.dispatch('emptyAllOutline')
    }
  }
}
</script>

<style lang="scss" scoped>
.command-container {
  display: flex;
  button {
    margin-right: 10px;
  }
}
</style>
