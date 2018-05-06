<template>
    <div class="node-note">{{ attributes.note }}</div>
</template>

<script>
  export default {
    name: 'node-note',
    props: {
      attributes: {
        type: Object
      },
      id: {
        type: String
      },
      parentid: {
        type: String
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