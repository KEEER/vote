<template>
  <div>
    <component
      v-for="(q, i) in subQuestions.filter(x => x.show)"
      :key="i"
      :is="q.type"
      ref="subQuestions"
      :value.sync="value_[i]"
      @update:value="syncValue"
      :options="(data.options || [])[i]"
    />
  </div>
</template>

<script>
import { questionMixin } from './question-mixin'

export default {
  name: 'VCombined',
  mixins: [ questionMixin ],
  data () {
    return {
      subQuestions: [],
      isForm: true,
    }
  },
  props: { value: {}, data: {} },
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
    syncValue () {
      this.value_ = [ ...this.value_ ]
    },
  },
}
</script>
