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

  render (h) {
    const list = this.crumbList.map((crumb, index) => {
      if (crumb.attributes && crumb._id) {
        return (
          <li key={index}>
            <a onClick={this.handleClick.bind(this, crumb._id)}>
              {crumb.attributes.text}
            </a>
            <i></i>
          </li>
        )
      }
      return null
    })

    return (
      <section class="crumb">
        <ul>{list}</ul>
      </section>
    )
  },

  methods: {
    handleClick (_id, evt) {
      evt.preventDefault()
      this.$router.push({ path: _id })
      this.$store.commit('updateCrumb', _id)
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
