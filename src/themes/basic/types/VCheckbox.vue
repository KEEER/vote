<template>
  <div>
    <VCheckboxInput
      v-for="option in data.options"
      :multiline="multiline"
      :key="option.value"
      :option="option"
      :value.sync="value_[option.value]"
      @update:value="syncValue"
    />
  </div>
</template>

<script>
import VCheckboxInput from './VCheckboxInput'

export default {
  name: 'VCheckbox',
  data () {
    return {
      value_: this.value || {},
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
  computed: {
    multiline () {
      if (!this.data.config || !this.data.config.theme || typeof this.data.config.theme.multiline === 'undefined') return true
      return this.data.config.theme.multiline
    },
  },
  methods: {
    syncValue () {
      this.$emit('update:value', { ...this.value_ })
    },
  },
}
</script>
