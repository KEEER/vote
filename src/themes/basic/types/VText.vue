<template>
  <input v-model="value_">
</template>

<script>
import { questionMixin as mixin } from '@vote/api'

export default {
  name: 'VText',
  mixins: [ mixin ],
  props: {
    value: {
      type: String,
      default: '',
    },
  },
}
</script>
