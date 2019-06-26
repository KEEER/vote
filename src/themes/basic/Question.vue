<template>
  <component
    :is="type"
    :data="data"
    :value.sync="value"
    ref="realQuestion">
    <slot />
  </component>
</template>

<script>
import * as Types from './types.js'
import hooks from './hooks'

// Fix Vue warning of Types being a Module
const types = {}
for(let i in Types) {
  types[i] = Types[i]
}

export default {
  name: 'Question',
  data() {
    return {
      value: this.$attrs.value,
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
    id: Number,
  },
  computed: {
    valid() {
      let valid = !this.data.required || !!this.value
      hooks.emit('question:validate', [this, v => valid = v])
      return valid
    },
  },
  provide() {
    return {Question: this}
  },
}
</script>
