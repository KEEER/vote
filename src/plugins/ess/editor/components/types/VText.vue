<template>
  <m-text-field :readonly="readonly" full-width v-model="value_" :placeholder="readonly ? $t('plugin-ess.question.noValuePlaceholder') : $t('plugin-ess.question.valuePlaceholder')">
    <m-line-ripple slot="bottomLine" />
  </m-text-field>
</template>

<style lang="scss">
@import '../../styles.scss';
@import 'material-components-vue/components/text-field/styles';
@import 'material-components-vue/components/line-ripple/styles';
</style>

<script>
import MTextField from 'material-components-vue/components/text-field/'
import MLineRipple from 'material-components-vue/components/line-ripple/'
import mixin from './mixin'

Vue.use(MTextField)
Vue.use(MLineRipple)

export default {
  name: 'VText',
  mixins: [ mixin ],
  props: {
    value: String,
    readonly: Boolean,
  },
}
</script>
