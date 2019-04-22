<template>
  <div>
    <h3>{{data.title}}</h3>
    <span v-for="option in data.options" :key="option.value">
      <input type="radio" v-model="value_" :id="option.value" :value="option.value" />
      <label :for="option.value">{{option.label}}</label>
    </span>
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  name: 'VRadio',
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      validator(val) {
        return val.title && val.options && val.options.every(op => op.label && op.value)
      },
    },
    value: String,
  },
}
</script>
