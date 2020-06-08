<template>
  <div>
    <component
      :is="q.type"
      v-for="(q, i) in subQuestions.filter(x => x.show)"
      :key="i"
      ref="subQuestions"
      :value.sync="value_[i]"
      :options="(data.options || [])[i]"
      @update:value="syncValue"
    />
  </div>
</template>

<script>
// A VCombined implementation for the form context.

import { questionMixin } from './question-mixin'

export default {
  name: 'VCombined',
  mixins: [ questionMixin ],
  props: { value: {}, data: {} },
  data () {
    return {
      subQuestions: [],
      isForm: true,
    }
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
  methods: {
    syncValue () { this.value_ = [ ...this.value_ ] },
  },
}
</script>
