<template>
  <div :class="{ hidden }">
    <QTitle class="question-title" :title="data.title" :required="data.required" />
    <m-typo-body class="description" :level="1" v-html="(data.description || {}).html || ''"></m-typo-body>
    <component
      :is="types[type]"
      :data="data"
      :value.sync="value"
      ref="realQuestion"
    >
      <slot />
    </component>
    <m-typo-body :level="1" class="invalid-tip" v-if="invalidTip">{{ invalidTip }}</m-typo-body>
  </div>
</template>

<style scoped>
.hidden { display: none; }
.question-title { margin-top: 16px; }
.invalid-tip { color: #d93025; display: block; }
.description { display: block; }
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
  components: { QTitle },
  props: {
    type: String,
    data: Object,
    id: Number,
  },
  computed: {
    validity () {
      let res
      /**
       * Question validation event.
       * @event form.question:validate
       * @type {object}
       * @property {form:Question} question the question Vue instance
       * @property {function} invalidate call to invalidate with reason
       */
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
