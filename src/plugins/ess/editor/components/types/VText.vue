<template>
  <m-text-field :readonly="readonly" full-width v-model="value_" :placeholder="readonly ? $t('plugin.ess.question.noValuePlaceholder') : $t('plugin.ess.question.valuePlaceholder')">
    <m-line-ripple slot="bottomLine" />
  </m-text-field>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'VText',
  mixins: [ mixin ],
  props: {
    value: String,
    readonly: Boolean,
  },
}
</script>
