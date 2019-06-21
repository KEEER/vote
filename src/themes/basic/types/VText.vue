<template>
  <div>
    <QTitle :title="data.title" :required="data.required" />
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
