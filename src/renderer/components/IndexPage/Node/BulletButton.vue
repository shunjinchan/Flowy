<template>
    <a class="bullet-button" 
       :class="{ collapse: isCollapsed }"
       @click.prevent="handleClick">
    </a>
</template>

<script>
export default {
  name: 'bullet-button',

  props: {
    isCollapsed: {
      type: Boolean
    },
    handleClick: {
      type: Function,
      default () {
        return () => {}
      }
    }
  },

  render (h) {
    return (
      <a class={{ 'bullet-button': true, collapse: this.isCollapsed }}
        onClick={this.handleClick}>
      </a>
    )
  }
}
</script>

<style lang="scss" scoped>
.bullet-button {
    width: 18px;
    height: 18px;
    margin: 1px 4px 1px 0;
    background: url("../../../assets/svg/bullet.svg") no-repeat;
    border-radius: 12px;
    &.collapse {
      background-color: #e0e0e0;
    }
    &:hover {
         background-color: #aaa;
    }
}
</style>
