<template>
  <component :is="type" :data="data">
    <slot />
  </component>
</template>

<script>
import Radio from './types/Radio'
import Checkbox from './types/Checkbox'
import Textinput from './types/Textinput'

export default {
  name: 'Question',
  data() {
    return {}
  },
  components: {
    Radio,
    Checkbox,
    Textinput,
  },
  props: {
    type: {
      type: String,
      validator(val) {
        return ['Radio', 'Checkbox', 'Textinput', 'Textarea'].indexOf(val) > -1
      },
    },
    data: Object,
  },
  computed: {
    value() {
      return this.$children[0].$data.value
    },
  },
  provide() {
    return {Question: this}
  }
}
</script>
