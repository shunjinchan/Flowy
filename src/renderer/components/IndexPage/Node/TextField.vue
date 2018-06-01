<!-- <template>
  <div class="text-field">
    <div class="input"
        contenteditable
        ref="input"
        v-text="text"
        @click="handleClick"
        @keypress.enter.prevent="handleKeypressEnter"
        @keydown.delete="handleKeydownDelete"
        @keydown.tab.prevent="handleKeydownTab" 
        @focus="handleFocus"
        @blur="handleBlur">
    </div>
  </div>
</template> -->

<script>
import SimpleText from '../../SimpleText/SimpleText'

export default {
  name: 'text-field',
  mixins: [SimpleText]
}
</script>

<style lang="scss" scoped>
.text-field {
  .input {
    outline: none;
  }
}
</style>
