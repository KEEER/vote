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
    <template v-else-if="statsData">
      <ul>
        <li v-for="{ value, count } in statsData" :key="value">{{ count > 1 ? $t('core.question.stats.textCount', { value, count }) : value }}</li>
      </ul>
      <m-typo-body class="has-more" :level="1" v-if="stats.hasMore">{{ $t('core.question.stats.textLimited', { count: stats.data.length }) }}</m-typo-body>
    </template>
    <m-typo-body v-else :level="1">{{ $t('core.question.stats.unavailableForQuestion') }}</m-typo-body>
  </div>
</template>

<style>
.question-textarea textarea { resize: vertical; }
</style>

<script>
import mixin from './mixin'
import { textStatsMixin } from './text-stats'

export default {
  name: 'VTextarea',
  mixins: [ mixin, textStatsMixin ],
  props: { value: String },
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #202124;
  margin: 4px 0;
  padding: 4px;
}
.has-more { color: #7e7e7e; }
</style>
