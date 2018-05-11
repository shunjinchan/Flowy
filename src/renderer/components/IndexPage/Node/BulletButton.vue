<template>
    <a href=""
       class="bullet-button">
    </a>
</template>

<script>
  export default {
    name: 'bullet-button',
    methods: {
      handleMouseenter () {}
    }
  }
</script>

<style lang="scss" scoped>
.bullet-button {
    width: 18px;
    height: 18px;
    margin: 1px 4px 1px 0;
    background: url("../../../assets/svg/bullet.svg") no-repeat;
    &:hover {
         background-color: #aaa;
         border-radius: 12px;
     }
}
</style>