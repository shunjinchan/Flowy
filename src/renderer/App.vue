<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import shortcut from './modules/shortcut'

export default {
  name: 'flowy',
  mounted () {
    shortcut.register(this)
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
