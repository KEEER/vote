<template>
  <component :is="type" :data="data">
    <slot />
  </component>
</template>

<script>
import * as Types from './types.js'

export default {
  name: 'Question',
  data() {
    return {}
  },
  components: Types,
  props: {
    type: {
      type: String,
      validator(val) {
        return val in Types
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
