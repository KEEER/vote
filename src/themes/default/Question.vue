<template>
  <div :class="{ hidden }">
    <QTitle class="question-title" :title="data.title" :required="data.required" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <m-typo-body class="description" :level="1" v-html="(data.description || {}).html || ''" />
    <component
      :is="types[type]"
      ref="questionContent"
      :data="data"
      :value.sync="value"
      :abstract-question="abstractQuestion"
    >
      <slot />
    </component>
    <QInvalidTip v-if="invalidTip" v-text="invalidTip" />
  </div>
</template>

<style scoped>
.hidden { display: none; }
.question-title { margin-top: 16px; }
.description { display: block; }
</style>

<script>
import { types } from './types'
import hooks from './hooks'
import { getConfig, AbstractFormQuestion } from '@vote/api'

export default {
  name: 'Question',
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
      abstractQuestion: new AbstractFormQuestion(this.data, this),
    }
  },
  computed: {
    validity () {
      let res
      /**
       * Question validation event.
       * @event form.question:validate
       * @type {object}
       * @property {AbstractFormQuestion} question the question
       * @property {function} invalidate call to invalidate with reason
       */
      hooks.emit('question:validate', { question: this.abstractQuestion, invalidate: r => res = { valid: false, reason: r } })
      if (typeof res === 'undefined') return { valid: true }
      return res
    },
    valid () { return this.validity.valid },
    hidden () { return this.abstractQuestion.getConfig('display', 'hidden', false) },
  },
  provide () {
    return { Question: this }
  },
}
</script>
