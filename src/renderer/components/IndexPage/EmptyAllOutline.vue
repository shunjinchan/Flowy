<template>
    <button @click="emptyAllOutline">清空</button>
</template>

<script>
  export default {
    name: 'empty-all-outline',
    methods: {
      emptyAllOutline () {
        this.$store.dispatch('emptyAllOutline')
      }
    }
  }
</script>

<style scoped>

</style>