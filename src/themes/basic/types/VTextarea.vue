<template>
  <div>
    <h3>{{data.title}}</h3>
    <textarea v-model="value_" />
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  name: 'VTextarea',
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      validator(val) {
        return val.title
      },
    },
    value: String,
  },
}
</script>
