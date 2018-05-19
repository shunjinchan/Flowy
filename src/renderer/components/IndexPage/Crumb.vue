<template>
  <section class="crumb">{{ crumb.current }}</section>
</template>

<script>
export default {
  name: 'crumb',
  props: {
    crumb: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped></style>
