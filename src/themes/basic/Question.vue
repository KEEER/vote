<template>
  <component :is="type" :data="data">
    <slot />
  </component>
</template>

<script>
import Radio from './types/Radio'
export default {
  name: 'Question',
  data() {
    return {}
  },
  components: {
    Radio,
    // Checkbox,
  },
  props: {
    type: {
      type: String,
      validator(val) {
        return ['Radio', 'Checkbox'].indexOf(val) > -1
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
