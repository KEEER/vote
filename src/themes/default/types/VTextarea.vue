<template>
  <m-text-field class="v-textarea" textarea v-model="value_" />
</template>

<style scoped>
.v-textarea { margin-top: 16px; }
</style>
<style>
.v-textarea textarea {
  resize: vertical;
  min-height: 64px;
}
</style>

<script>
import { questionMixin as mixin } from '@vote/api'

export default {
  name: 'VTextarea',
  mixins: [ mixin ],
  props: {
    data: {
      type: Object,
      validator: val => !!val.title,
    },
    value: String,
  },
}
</script>
