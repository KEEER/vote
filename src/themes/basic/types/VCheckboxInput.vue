<template>
  <span>
    <input type="checkbox" v-model="value_" :id="uid" :value="option.value" />
    <label :for="uid">{{option.label}}</label>
    <br v-if="multiline" />
  </span>
</template>

<script>
import { questionMixin as mixin } from '@vote/api'

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
