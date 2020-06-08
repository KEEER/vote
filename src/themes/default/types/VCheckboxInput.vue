<template>
  <span class="checkbox" :class="{ multiline }">
    <m-checkbox :id="uid" v-model="value_" :value="option.value" />
    <label :for="uid"><m-typo-body :level="1" v-text="option.label" /></label>
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
import { questionMixin as mixin } from '@vote/api'

export default {
  name: 'VCheckboxInput',
  mixins: [ mixin ],
  props: {
    option: {
      type: Object,
      required: true,
    },
    value: Boolean,
    multiline: Boolean,
  },
  data () {
    return {
      question_: this.$parent.$parent,
    }
  },
}
</script>
