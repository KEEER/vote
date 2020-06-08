<template>
  <span>
    <input :id="uid" v-model="value_" type="checkbox" :value="option.value">
    <label :for="uid" v-text="option.label" />
    <br v-if="multiline">
  </span>
</template>

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
