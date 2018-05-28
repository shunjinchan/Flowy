<template>
    <div class="command-container">
      <button @click="emptyAllNode">{{ text }}</button>
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
    async emptyAllNode () {
      await this.$store.dispatch('emptyAllNode')
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
