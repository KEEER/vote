<template>
  <m-text-field v-model="value_" class="v-text" full-width>
    <m-line-ripple slot="bottomLine" />
  </m-text-field>
</template>

<style scoped>
.v-text { max-width: 411px; }
</style>

<script>
import { questionMixin as mixin } from '@vote/api'

export default {
  name: 'VText',
  mixins: [ mixin ],
  props: {
    data: {
      type: Object,
      validator: v => !!v.title,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
}
</script>
