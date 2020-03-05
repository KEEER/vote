<template>
  <span class="checkbox" :class="{ multiline }">
    <m-checkbox v-model="value_" :id="uid" :value="option.value" />
    <label :for="uid"><m-typo-body :level="1">{{option.label}}</m-typo-body></label>
  </span>
</template>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
}
.checkbox.multiline { display: flex; }
</style>

<script>
import mixin from './mixin'

export default {
  name: 'VCheckboxInput',
  mixins: [ mixin ],
  data () {
    return {
      question_: this.$parent.$parent,
    }
  },
  props: {
    option: Object,
    value: Boolean,
    multiline: Boolean,
  },
}
</script>
