<template>
  <span>
    <input type="checkbox" v-model="value_" :id="uid" :value="option.value" />
    <label :for="uid">{{option.label}}</label>
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
