<template>
  <div :class="{ hidden }">
    <QTitle :title="data.title" :required="data.required" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="(data.description || {}).html || ''" />
    <component
      :is="types[type]"
      ref="questionContent"
      :data="data"
      :value.sync="value"
    >
      <slot />
    </component>
    <div v-if="invalidTip" class="invalid-tip" v-text="invalidTip" />
  </div>
</template>

<style scoped>
.hidden { display: none; }
.invalid-tip { color: #d93025; }
</style>

<script>
import { types } from './types'
import hooks from './hooks'
import QTitle from './Title.vue'
import { getConfig } from '@vote/api'

export default {
  name: 'Question',
  components: { QTitle },
  props: {
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: Number,
      required: true,
    },
  },
  data () {
    return {
      value: this.$attrs.value,
      types,
      invalidTip: '',
    }
  },
  computed: {
    validity () {
      let res
      hooks.emit('question:validate', { question: this, invalidate: r => res = { valid: false, reason: r } })
      if (typeof res === 'undefined') return { valid: true }
      return res
    },
    valid () { return this.validity.valid },
    hidden () { return getConfig(this.data, 'display', 'hidden', false) },
  },
  provide () {
    return { Question: this }
  },
}
</script>
