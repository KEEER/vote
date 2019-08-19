<template>
  <m-text-field textarea v-model="value_" :id="uid">
    <m-floating-label :for="uid">{{texts.question.valuePlaceholder}}</m-floating-label>
  </m-text-field>
</template>

<script>
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'
import mixin from './mixin'

Vue.use(MTextField)
Vue.use(MFloatingLabel)

export default {
  name: 'VTextarea',
  mixins: [mixin],
  props: {
    value: String,
  },
}
</script>
