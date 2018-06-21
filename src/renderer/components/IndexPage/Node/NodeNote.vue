<script>
import _ from 'lodash'
import NoteField from './NoteField'

export default {
  name: 'node-note',

  data () {
    return {
      isFocus: false
    }
  },

  props: {
    nodeData: {
      type: Object
    },
    parentid: {
      type: String
    },
    updateNode: {
      type: Function,
      default () {
        return () => {}
      },
      require: false
    }
  },

  render (h) {
    const nodeText = (this.isFocus || this.note) ? (
      <div class="node-note">
        <note-field isFocus={this.isFocus}
          text={this.note}
          handleFocus={this.handleTextFocus}
          handleBlur={this.handleTextBlur} />
      </div>
    ) : null

    return ({nodeText})
  },

  computed: {
    _id () {
      return this.nodeData._id
    },

    note () {
      return _.get(this.nodeData, 'attributes.note')
    }
  },

  components: {
    NoteField
  },

  methods: {
    handleTextFocus (evt) {
      this.$store.commit('updateNoteFieldFocusStatus', true)
      this.isFocus = true
    },

    handleTextBlur (evt) {
      this.$store.commit('updateNoteFieldFocusStatus', false)
      this.isFocus = false
    },

    addNodeNote ({ evt, lastEditNode }) {
      if (this._id === lastEditNode) this.isFocus = true
    },

    async updateNodeNote ({ evt, lastEditNode }) {
      if (this._id !== lastEditNode) return

      const data = _.merge({}, this.nodeData, {
        attributes: { note: evt.target.innerHTML }
      })
      await this.updateNode(data)
    },

    bindEvents () {
      this.$root.$on('command:addNodeNote', this.addNodeNote)
      this.$root.$on('command:updateNodeNote', this.updateNodeNote)
    }
  },

  mounted () {
    this.bindEvents()
  },

  beforeDestroy () {
    this.$root.$off('command:addNodeNote', this.addNodeNote)
    this.$root.$off('command:updateNodeNote', this.updateNodeNote)
  }
}
</script>

<style lang="scss" scoped>
.node-note {
    color: #999;
    font-size: 13px;
    padding: 0 15px 0 23px;
}
</style>
