<template>
    <div class="page index">
        <h2>Node {{ $route.params.id }}</h2>
        <router-view></router-view>
    </div>
</template>

<script>
import Board from './IndexPage/Board'

export default {
  name: 'index-page',
  components: {
    Board
  }
}
</script>

<style lang="scss">
html {
    overflow-y: scroll;
}
body {
    position: relative;
    margin: 0;
    background: #f6f6f6;
    overflow-x: hidden;
}
</style>
