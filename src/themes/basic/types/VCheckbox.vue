<template>
  <div>
    <h3>{{data.title}}</h3>
    <span v-for="option in data.options" :key="option.value">
      <input type="checkbox" v-model="value_[option.value]" :id="option.value" :value="option.value" />
      <label :for="option.value">{{option.label}}</label>
    </span>
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  name: 'VCheckbox',
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      validator(val) {
        return val.title && val.options && val.options.every(op => op.label && op.value)
      },
    },
    value: Object,
  },
}
</script>
