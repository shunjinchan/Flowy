<template>
  <div id="app" class="app">
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
html, body, .app {
  min-height: 100%;
}
a {
  &:hover {
    cursor: pointer;
  }
}
</style>
