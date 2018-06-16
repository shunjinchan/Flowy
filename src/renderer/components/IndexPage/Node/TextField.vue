<script>
import SimpleText from '../../SimpleText/SimpleText'

export default {
  name: 'text-field',

  mixins: [SimpleText],

  methods: {
    handleKeydownShiftAndMetaAndB (evt) {
      evt.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
.simple-text {
  .input {
    outline: none;
  }
}
</style>
