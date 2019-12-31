<template>
  <div>
    <QTitle :title="data.title" :required="data.required" />
    <VCheckboxInput
      v-for="option in data.options"
      :key="option.value"
      :option="option"
      :value.sync="value_[option.value]">
    </VCheckboxInput>
  </div>
</template>

<script>
import VCheckboxInput from './VCheckboxInput'
import QTitle from '../Title'

export default {
  name: 'VCheckbox',
  data () {
    return {
      value_: this.value,
    }
  },
  components: {
    VCheckboxInput,
    QTitle,
  },
  props: {
    data: {
      type: Object,
      validator (val) {
        return val.title && val.options && val.options.every(op => op.label && op.value)
      },
    },
    value: Object,
  },
}
</script>
