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
    <ul v-else-if="statsData">
      <li v-for="{ value, count } in statsData" :key="value">{{ count > 1 ? $t('core.question.stats.textCount', { value, count }) : value }}</li>
      <li class="has-more" v-if="stats.hasMore">{{ $t('core.question.stats.textLimited', { count: stats.data.length }) }}</li>
    </ul>
    <m-typo-body v-else :level="1">{{ $t('core.question.stats.unavailableForQuestion') }}</m-typo-body>
  </div>
</template>

<script>
import mixin from './mixin'
import { textStatsMixin } from './text-stats'

export default {
  name: 'VText',
  mixins: [ mixin, textStatsMixin ],
  props: { value: String },
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 8px;
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #202124;
}
li {
  padding: 4px 0;
  border-bottom: 1px solid #e0e0e0;
}
li:first-child { padding-top: 0; }
li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
.has-more { color: #909092; }
</style>
