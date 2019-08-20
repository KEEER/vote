<template>
  <m-text-field full-width v-model="value_" :placeholder="texts.question.valuePlaceholder">
    <m-line-ripple slot="bottomLine" />
  </m-text-field>
</template>

<style lang="scss">
@import '../../styles.scss';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/line-ripple/styles';
</style>

<script>
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MLineRipple from 'material-components-vue/dist/line-ripple/line-ripple.min.js'
import mixin from './mixin'

Vue.use(MTextField)
Vue.use(MLineRipple)

export default {
  name: 'VText',
  mixins: [mixin],
  props: {
    value: String,
  },
}
</script>
