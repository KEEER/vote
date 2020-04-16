<template>
  <div :class="{ hidden }">
    <QTitle :title="data.title" :required="data.required" />
    <div v-html="(data.description || {}).html || ''"></div>
    <component
      :is="types[type]"
      :data="data"
      :value.sync="value"
      ref="realQuestion">
      <slot />
    </component>
    <div class="invalid-tip" v-if="invalidTip">{{ invalidTip }}</div>
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
  data () {
    return {
      value: this.$attrs.value,
      types,
      invalidTip: '',
    }
  },
  components: {
    QTitle,
  },
  props: {
    type: String,
    data: Object,
    id: Number,
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
