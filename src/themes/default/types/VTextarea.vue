<template>
  <m-text-field v-model="value_" class="v-textarea" textarea />
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
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
}
</script>
