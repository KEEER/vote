<template>
  <div>
    <component
      :is="q.type"
      v-for="(q, i) in subQuestions.filter(x => x.show)"
      :key="i"
      ref="subQuestions"
      v-model="value_[i]"
      :route="route"
      :stats="stats"
      :options.sync="options_[i]"
      @input="syncValue"
      @update:options="$nextTick(() => $emit('update:options', [ ...options ])); options[i] = $event"
    />
  </div>
</template>

<script>
import hooks from '../../hooks'
import mixin from './mixin'

export default {
  name: 'VCombined',
  mixins: [ mixin ],
  props: { value: {}, config: {}, options: {} },
  data () {
    return {
      subQuestions: [],
      config_: this.config || [],
      options_: this.options || [],
    }
  },
  mounted () {
    /**
     * VCombined mounted event. Inject sub-questions here.
     * Sub-questions should be of the type `{ type: String, show: Boolean }`.
     * @event editor.v-combined:mounted
     * @type {editor.VCombined}
     * @example hooks.on('v-combined:mounted', vm => vm.subQuestions = [ { type: 'VText', show: true } ])
     */
    hooks.emit('v-combined:mounted', this)
    if (!this.value_) this.value_ = []
  },
  methods: {
    syncValue () {
      this.$emit('input', [ ...this.value_ ])
    },
  },
}
</script>
