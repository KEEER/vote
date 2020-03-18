<template>
  <div>
    <m-text-field
      v-if="!isStats"
      :readonly="isData"
      full-width
      v-model="value_"
      :placeholder="isData ? $t('plugin.ess.question.noValuePlaceholder') : $t('plugin.ess.question.valuePlaceholder')"
    >
      <m-line-ripple slot="bottomLine" />
    </m-text-field>
    <m-typo-body v-else :level="1">{{$t('core.question.stats.unavailableForType')}}</m-typo-body>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'VText',
  mixins: [ mixin ],
  props: {
    value: String,
  },
}
</script>
