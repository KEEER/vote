<template>
  <div>
    <component
      v-for="(q, i) in subQuestions.filter(x => x.show)"
      :key="i"
      :is="q.type"
      ref="subQuestions"
      v-model="value_[i]"
      @input="syncValue"
      :route="route"
      :stats="stats"
      :options.sync="options_[i]"
      @update:options="$nextTick(() => $emit('update:options', [ ...options ])); options[i] = $event"
    />
  </div>
</template>

<script>
import mixin from './mixin'
import hooks from '../../hooks'

export default {
  name: 'VCombined',
  mixins: [ mixin ],
  data () {
    return {
      subQuestions: [],
      config_: this.config || [],
      options_: this.options || [],
    }
  },
  props: { value: {}, config: {}, options: {} },
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
