<template>
  <textarea v-model="value_" />
</template>

<script>
import { questionMixin as mixin } from '@vote/api'

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
