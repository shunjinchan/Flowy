<template>
  <crumb :crumb="crumb" />
</template>

<script>
import Crumb from './Crumb'
export default {
  name: 'crumb-container',
  components: {
    Crumb
  },
  computed: {
    crumb () {
      return this.$store.state.Crumb
    }
  }
}
</script>
