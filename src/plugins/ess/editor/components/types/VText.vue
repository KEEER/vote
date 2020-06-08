<template>
  <div>
    <m-text-field
      v-if="!isStats"
      v-model="value_"
      :readonly="isData"
      full-width
      :placeholder="isData ? $t('plugin.ess.question.noValuePlaceholder') : $t('plugin.ess.question.valuePlaceholder')"
    >
      <m-line-ripple slot="bottomLine" />
    </m-text-field>
    <ul v-else-if="statsData">
      <li v-for="{ value, count } in statsData" :key="value" v-text="count > 1 ? $t('core.question.stats.textCount', { value, count }) : value" />
      <li v-if="stats.hasMore" class="has-more" v-text="$t('core.question.stats.textLimited', { count: stats.data.length })" />
    </ul>
    <m-typo-body v-else :level="1" v-text="$t('core.question.stats.unavailableForQuestion')" />
  </div>
</template>

<script>
import mixin from './mixin'
import { textStatsMixin } from './text-stats'

export default {
  name: 'VText',
  mixins: [ mixin, textStatsMixin ],
  props: {
    value: {
      type: String,
      default: '',
    },
  },
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
