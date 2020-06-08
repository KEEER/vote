<template>
  <div>
    <span v-for="option in data.options" :key="option.value">
      <input :id="$id(option.value)" v-model="value_" type="radio" :value="option.value">
      <label :for="$id(option.value)" v-text="option.label" />
    </span>
  </div>
</template>

<script>
import { questionMixin as mixin } from '@vote/api'

export default {
  name: 'VRadio',
  mixins: [ mixin ],
  props: {
    data: {
      type: Object,
      validator (val) {
        const e = x => typeof x !== 'undefined'
        return e(val.title) && e(val.options) && val.options.every(op => e(op.label) && e(op.value))
      },
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
}
</script>
