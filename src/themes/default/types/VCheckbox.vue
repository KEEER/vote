<template>
  <div>
    <VCheckboxInput
      v-for="option in options"
      :key="option.value"
      :multiline="multiline"
      :option="option"
      :value.sync="value_[option.value]"
      @update:value="syncValue"
    />
  </div>
</template>

<script>
import VCheckboxInput from './VCheckboxInput.vue'
import { getConfig, shuffle } from '@vote/api'

export default {
  name: 'VCheckbox',
  inject: [ 'Question' ],
  components: { VCheckboxInput },
  props: {
    data: {
      type: Object,
      validator (val) {
        const nonnull = a => a !== null && a !== undefined
        return val.title && val.options && val.options.every(op => nonnull(op.label) && nonnull(op.value))
      },
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      value_: this.value || {},
      getQuestionConfig: getConfig,
    }
  },
  computed: {
    options () {
      return getConfig(this.data, 'theme', 'randomOrder', false) ? shuffle(this.data.options) : this.data.options
    },
    multiline () {
      return getConfig(this.data, 'theme', 'multiline', true)
    },
  },
  watch: {
    value (val) { this.value_ = val },
  },
  methods: {
    syncValue () {
      this.$emit('update:value', { ...this.value_ })
    },
  },
}
</script>
