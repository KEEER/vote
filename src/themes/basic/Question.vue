<template>
  <component :is="type" :data="data" :value="value">
    <slot />
  </component>
</template>

<script>
import * as Types from './types.js'

//Fix Vue warning of Types being a Module
const types = {}
for(let i in Types) {
  types[i] = Types[i]
}

export default {
  name: 'Question',
  data() {
    return {
      value: this.$attrs.value
    }
  },
  components: types,
  props: {
    type: {
      type: String,
      validator(val) {
        return val in Types
      },
    },
    data: Object,
  },
  computed: {},
  provide() {
    return {Question: this}
  }
}
</script>
