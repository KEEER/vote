<template>
  <div>
    <m-text-field
      v-if="!isStats"
      :readonly="isData"
      class="question-textarea"
      textarea
      v-model="value_"
      :id="uid"
    >
      <m-floating-label v-if="isEditor || !value_" :for="uid">
        {{$t(isData ? 'plugin.ess.question.noValuePlaceholder' : 'plugin.ess.question.valuePlaceholder')}}
      </m-floating-label>
    </m-text-field>
    <m-typo-body v-else :level="1">{{$t('core.question.stats.unavailableForType')}}</m-typo-body>
  </div>
</template>

<style>
.question-textarea textarea { resize: vertical; }
</style>

<script>
import mixin from './mixin'

export default {
  name: 'VTextarea',
  mixins: [ mixin ],
  props: { value: String },
}
</script>
