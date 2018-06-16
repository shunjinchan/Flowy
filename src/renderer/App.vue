<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import globalShortcut from './modules/globalShortcut'

export default {
  name: 'flowy',
  mounted () {
    globalShortcut.register(this)
  }
}
</script>

<style lang="scss">
a {
  &:hover {
    cursor: pointer;
  }
}
</style>
