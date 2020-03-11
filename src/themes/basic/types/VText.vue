<template>
  <input v-model="value_" />
</template>

<script>
import { questionMixin as mixin } from '@vote/api'

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
