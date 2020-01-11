<template>
  <input v-model="value_" />
</template>

<script>
import mixin from './mixin'
export default {
  name: 'VText',
  mixins: [ mixin ],
  props: {
    data: {
      type: Object,
      validator (val) {
        return val.title
      },
    },
    value: String,
  },
}
</script>
