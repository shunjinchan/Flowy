<script>
export default {
  name: 'expand-button',

  props: {
    handleClick: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    }
  },

  render (h) {
    return (
      <div class="expand-button" onClick={this.handleClick}>
        <svg viewBox="0 0 20 20" version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          <line x1="5.5" y1="10" x2="14.5" y2="10"></line>
          <line x1="10" y1="5.5" x2="10" y2="14.5"></line>
        </svg>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.expand-button {
    width: 20px;
    height: 20px;
    svg {
        stroke-width: 2;
        stroke: #666;
    }
}
</style>
