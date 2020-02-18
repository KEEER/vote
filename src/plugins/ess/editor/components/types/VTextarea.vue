<template>
  <m-text-field :readonly="readonly" class="question-textarea" textarea v-model="value_" :id="uid">
    <m-floating-label v-if="!readonly || !value_" :for="uid">{{readonly ? $t('plugin.ess.question.noValuePlaceholder') : $t('plugin.ess.question.valuePlaceholder')}}</m-floating-label>
  </m-text-field>
</template>

<style>
.question-textarea textarea {
  resize: vertical;
}
</style>

<script>
import mixin from './mixin'

export default {
  name: 'VTextarea',
  mixins: [ mixin ],
  props: {
    value: String,
    readonly: Boolean,
  },
}
</script>
