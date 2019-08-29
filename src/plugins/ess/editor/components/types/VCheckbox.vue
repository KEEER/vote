<template>
  <ul class="checkbox-ul">
    <m-icon-button @click="add">
      <m-icon icon="add" />
    </m-icon-button>
    <draggable
      v-model="options_"
      @start="dragging = true"
      @end="syncOptions"
      :animation="200"
      handle=".handle"
      ghost-class="ghost"
    >
      <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
        <VCheckboxInput
          v-for="option in options_"
          :key="option.value"
          :label.sync="option.label"
          @update:label="syncOptions"
          @remove="remove"
          :cbvalue="option.value"
          :value.sync="value_[option.value]"
          @update:value="syncValue"
          :texts="texts"
        />
      </transition-group>
    </draggable>
  </ul>
</template>

<style lang="scss">
@import '../../styles.scss';
@import 'material-components-vue/dist/icon-button/styles';
</style>

<style scoped>
.checkbox-ul {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.ghost {
  opacity: 0.5;
}
</style>

<script>
import MIconButton from 'material-components-vue/dist/icon-button/icon-button.min.js'
import MIcon from 'material-components-vue/dist/icon/icon.min.js'
import VCheckboxInput from './VCheckboxInput'
import draggable from 'vuedraggable'

Vue.use(MIconButton)
Vue.use(MIcon)

export default {
  name: 'VCheckbox',
  props: {
    value: Object,
    options: {},
    texts: Object,
  },
  components: {
    VCheckboxInput,
    draggable,
  },
  data() {
    return {
      value_: this.value || {},
      options_: this.options,
      dragging: false,
    }
  },
  methods: {
    add() {
      this.options_ = this.options_ || []
      const value = this.options_.map(o => o.value).reduce((a, b) => Math.max(a, b), -1) + 1
      this.options_.push({
        label: '',
        value,
      })
      this.syncOptions()
    },
    remove(index) {
      this.options_.splice(index, 1)
      this.syncOptions()
    },
    syncOptions() {
      this.$emit('update:options', [...this.options_])
    },
    syncValue() {
      this.$emit('input', Object.assign({}, this.value_))
    },
  },
  watch: {
    value_(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.value_ = val
    },
    options(val) {
      this.options_ = val
    },
  },
}
</script>
