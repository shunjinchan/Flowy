<template>
  <section class="crumb">
    <ul>
      <li v-for="(crumb, index) in crumbList" :key="index">
          <a @click.prevent="handleClick(crumb._id)">
            {{ crumb.attributes.text }}
          </a>
        <i></i>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'crumb',
  props: {
    crumbList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    handleClick (_id) {
      this.$router.push({ path: _id })
      this.$store.dispatch('updateCrumb', _id)
    }
  }
}
</script>

<style lang="scss" scoped>
.crumb {
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ul {
    display: flex;
    margin: 5px 0;
  }
  li {
    line-height: 18px;
    display: flex;
    a {
      text-decoration: none;
      color: #666;
      &:hover {
        text-decoration: underline;
      }
    }
    i {
      padding: 0 2px 0 3px;
      margin: 0 5px;
      color: #aaa;
      &::before {
        content: ">";
      }
    }
  }
}
</style>
