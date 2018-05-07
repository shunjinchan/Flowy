<template>
    <div class="node-note">{{ note }}</div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'node-note',
    props: {
      data: {
        type: Object
      },
      parentid: {
        type: String
      }
    },
    computed: {
      note () {
        return _.get(this.data, 'attributes.note')
      }
    }
  }
</script>

<style scoped>
.node-note {
    color: #999;
    font-size: 13px;
    padding: 0 15px 0 23px;
}
</style>