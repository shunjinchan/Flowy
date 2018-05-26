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
    async emptyAllOutline () {
      await this.$store.dispatch('emptyAllOutline')
      this.$store.commit('emptyCrumb')
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
