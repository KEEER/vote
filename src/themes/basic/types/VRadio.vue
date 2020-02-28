<template>
  <div>
    <span v-for="option in data.options" :key="option.value">
      <input type="radio" v-model="value_" :id="$id(option.value)" :value="option.value" />
      <label :for="$id(option.value)">{{option.label}}</label>
    </span>
  </div>
</template>

<script>
import mixin from './mixin'
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
    },
    value: String,
  },
}
</script>
