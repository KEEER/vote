<template>
  <div>
    <QTitle :title="data.title" :required="data.required" />
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
        return val.title && val.options && val.options.every(op => op.label && op.value)
      },
    },
    value: String,
  },
}
</script>
