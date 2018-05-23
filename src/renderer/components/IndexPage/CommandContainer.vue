<template>
    <div class="command-container">
      <div>{{ count }}</div>
      <button @click="emptyAllOutline">清空</button>
      <button v-stream:click="plus$">+</button>
      <button v-stream:click="{ subject: minus$, data: -1 }">-</button>
    </div>
</template>

<script>
  import Rx from 'rxjs/Rx'

  export default {
    name: 'command-container',
    domStreams: ['plus$', 'minus$'],
    subscriptions () {
      var count$ = Rx.Observable
        .merge(
          this.plus$.map(() => 1),
          this.minus$.pluck('data')
        )
        .startWith(0)
        .scan((total, change) => total + change)
      return {
        count: count$
      }
    },
    methods: {
      emptyAllOutline () {
        console.log(this)
        // this.$store.dispatch('emptyAllOutline')
        console.log('emptyAllOutline')
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
