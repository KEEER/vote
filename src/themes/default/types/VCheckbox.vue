<template>
  <div>
    <VCheckboxInput
      v-for="option in getQuestionConfig(data, 'theme', 'randomOrder', false) ? shuffle(data.options) : data.options"
      :multiline="getQuestionConfig(data, 'theme', 'multiline', true)"
      :key="option.value"
      :option="option"
      :value.sync="value_[option.value]"
      @update:value="syncValue"
    />
  </div>
</template>

<script>
import VCheckboxInput from './VCheckboxInput'
import { getQuestionConfig, shuffle } from '../util'

export default {
  name: 'VCheckbox',
  inject: [ 'Question' ],
  data () {
    return {
      value_: this.value || {},
      getQuestionConfig,
      shuffle,
    }
  },
  components: { VCheckboxInput },
  props: {
    data: {
      type: Object,
      validator (val) {
        const nonnull = a => a !== null && a !== undefined
        return val.title && val.options && val.options.every(op => nonnull(op.label) && nonnull(op.value))
      },
    },
    value: Object,
  },
  methods: {
    syncValue () {
      this.$emit('update:value', { ...this.value_ })
    },
  },
}
</script>
