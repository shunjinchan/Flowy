<template>
    <div class="page index">
        <board></board>
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