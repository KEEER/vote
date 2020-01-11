<template>
  <textarea v-model="value_" />
</template>

<script>
import mixin from './mixin'
export default {
  name: 'VTextarea',
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
