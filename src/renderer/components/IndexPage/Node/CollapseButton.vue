<template>
    <div class="collapse-button" @click="handleClick">
        <svg viewBox="0 0 20 20" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
            <line x1="5.5" y1="10" x2="14.5" y2="10"></line>
        </svg>
    </div>
</template>

<script>
export default {
  name: 'collapse-button',
  props: {
    handleClick: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse-button {
    width: 20px;
    height: 20px;
    svg {
        stroke-width: 2;
        stroke: #666;
    }
}
</style>
