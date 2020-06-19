<template>
  <div>
    <div v-for="(q, i) in subQuestions.filter(x => x.show)" :key="i">
      <component
        :is="q.type"
        ref="subQuestions"
        :value.sync="value_[i]"
        :options="(data.options || [])[i]"
        :data="subQuestions[i]"
        :abstract-question="abstractQuestions[i]"
        @update:value="syncValue"
      />
      <QInvalidTip v-if="invalidTip[i]" v-text="invalidTip[i]" />
    </div>
  </div>
</template>

<script>
// A VCombined implementation for the form context.

import { questionMixin } from './question-mixin'
import { AbstractFormQuestion } from '@vote/api'

class AbstractVCombinedFormQuestion extends AbstractFormQuestion {
  constructor (options, vueInstance, index) {
    super(options, vueInstance)
    this.index = index
  }
  get value () { return this.vueInstance.value_[this.index] }
  set value (value) { this.vueInstance.value_[this.index] = value }
  get validity () { return this.vueInstance.validity[this.index] }
  get invalidTip () { return this.vueInstance.invalidTip[this.index] }
  set invalidTip (value) { this.vueInstance.invalidTip[this.index] = value }
}

export default {
  name: 'VCombined',
  mixins: [ questionMixin ],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      subQuestions: [],
      isForm: true,
      validationCallback: ({ question, invalidate }) => {
        if (question.vueInstance === this.Question) {
          this.subQuestions.forEach((q, i) => {
            let reason
            window.voteHooks.emit('question:validate', {
              question: this.abstractQuestions[i],
              invalidate: r => reason = r,
            })
            if (typeof reason !== 'undefined') this.validity[i] = { valid: false, reason }
            else this.validity[i] = { valid: true }
          })
          if (this.validity.some(x => !x.valid)) invalidate('invalid-v-combined')
        }
      },
      updateCallback: ({ question }) => {
        if (question.vueInstance === this.Question) {
          this.subQuestions.forEach((_, i) => {
            const question = this.abstractQuestions[i]
            window.voteHooks.emit('question:update', { question, value: question.value, oldValue: this.$refs.subQuestions[i].old })
          })
        }
      },
      validity: [],
      invalidTip: [],
    }
  },
  computed: {
    abstractQuestions () {
      return this.subQuestions.map((q, i) => new AbstractVCombinedFormQuestion({ ...q, value: this.value_[i] }, this, i))
    },
  },
  created () {
    window.voteHooks.on('question:validate', this.validationCallback)
    window.voteHooks.on('question:update', this.updateCallback)
  },
  mounted () {
    /**
     * VCombined mounted event. Inject sub-questions here.
     * Sub-questions should be of the type `{ type: String, show: Boolean }`.
     * @event form.v-combined:mounted
     * @type {form.VCombined}
     * @example hooks.on('v-combined:mounted', vm => vm.subQuestions = [ { type: 'VText', show: true } ])
     */
    window.voteHooks.emit('v-combined:mounted', this)
  },
  beforeDestroy () {
    window.voteHooks.off('question:validate', this.validationCallback)
    window.voteHooks.off('question:update', this.updateCallback)
  },
  methods: {
    syncValue () { this.value_ = [ ...this.value_ ] },
  },
}
</script>
