<template>
  <div>
    <h3>{{data.title}}</h3>
    <input v-model="value_" />
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  name: 'VText',
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
