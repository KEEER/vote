<template>
  <div>
    <m-select v-if="type" :id="uid" outlined enhanced v-model="type">
      <m-list-item v-for="k in typeKeys" :key="k" :data-value="k" aria-selected="false">{{ types[k] }}</m-list-item>
      <m-floating-label :for="uid" slot="label">{{ $t('plugin.autofill.type') }}</m-floating-label>
    </m-select>
  </div>
</template>

<script>
// Vue component for the editor component for VAutofill.
export default {
  name: 'VoteAutofillEditor',
  inject: [ 'Question' ],
  props: {
    value: {},
    options: {},
  },
  data () {
    return {
      type: this.options ? this.options.type : '',
      types: this.$t('plugin.autofill.types'),
      typeKeys: Object.keys(this.$t('plugin.autofill.types')),
    }
  },
  watch: {
    config (val) { if (val && val.type) this.type = type },
    type (val) {
      this.$emit('update:options', { type: val })
      this.Question.title_ = this.$t(`plugin.autofill.types.${val}`)
    },
  },
  mounted () {
    if (!this.type) this.$nextTick(() => this.type = 'name')
  },
}
</script>
