<template>
  <m-text-field :readonly="readonly" class="question-textarea" textarea v-model="value_" :id="uid">
    <m-floating-label v-if="!readonly || !value_" :for="uid">{{readonly ? texts.question.noValuePlaceholder : texts.question.valuePlaceholder}}</m-floating-label>
  </m-text-field>
</template>

<style lang="scss">
@import '../../styles.scss';
@import 'material-components-vue/components/text-field/styles';
@import 'material-components-vue/components/floating-label/styles';
</style>

<style>
.question-textarea textarea {
  resize: vertical;
}
</style>

<script>
import MTextField from 'material-components-vue/components/text-field/'
import MFloatingLabel from 'material-components-vue/components/floating-label/'
import mixin from './mixin'

Vue.use(MTextField)
Vue.use(MFloatingLabel)

export default {
  name: 'VTextarea',
  mixins: [ mixin ],
  props: {
    value: String,
    readonly: Boolean,
  },
}
</script>
