<template>
  <m-text-field class="v-text" full-width v-model="value_">
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
      validator (val) {
        return val.title
      },
    },
    value: String,
  },
}
</script>
