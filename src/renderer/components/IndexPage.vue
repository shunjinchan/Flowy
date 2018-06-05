<template>
    <div class="page index">
        <header>header</header>
        <command-container />
        <router-view></router-view>
    </div>
</template>

<script>
import Board from './IndexPage/Board'
import CommandContainer from './IndexPage/CommandContainer'
import { getLastRouter, setLastRouter } from '@/modules/storage'

export default {
  name: 'index-page',
  components: {
    Board,
    CommandContainer
  },
  mounted () {
    const lastRouter = 'root'
    this.$router.push({path: lastRouter})
    setLastRouter(lastRouter)
  },
  watch: {
    '$route' (to, from) {
      // setLastRouter(to.params.id)
    }
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
