<template>
  <span>
    <input type="checkbox" v-model="value_" :id="option.value" :value="option.value" />
    <label :for="option.value">{{option.label}}</label>
  </span>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'VCheckboxInput',
  mixins: [mixin],
  data() {
    return {
      question_: this.$parent.$parent,
    }
  },
  props: {
    option: Object,
    value: Boolean,
  },
}
</script>
