<template>
  <div>
    <m-select v-if="type" :id="uid" v-model="type" outlined enhanced>
      <m-list-item v-for="k in typeKeys" :key="k" :data-value="k" aria-selected="false" v-text="types[k]" />
      <m-floating-label slot="label" :for="uid" v-text="$t('plugin.autofill.type')" />
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
