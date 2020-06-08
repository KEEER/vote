<template>
  <div>
    <m-text-field
      v-if="!isStats"
      :id="uid"
      v-model="value_"
      :readonly="isData"
      class="question-textarea"
      textarea
    >
      <m-floating-label v-if="isEditor || !value_" :for="uid" v-text="$t(isData ? 'plugin.ess.question.noValuePlaceholder' : 'plugin.ess.question.valuePlaceholder')" />
    </m-text-field>
    <template v-else-if="statsData">
      <ul>
        <li v-for="{ value, count } in statsData" :key="value" v-text="count > 1 ? $t('core.question.stats.textCount', { value, count }) : value" />
      </ul>
      <m-typo-body v-if="stats.hasMore" class="has-more" :level="1" v-text="$t('core.question.stats.textLimited', { count: stats.data.length })" />
    </template>
    <m-typo-body v-else :level="1" v-text="$t('core.question.stats.unavailableForQuestion')" />
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
  padding: 0;
}
li {
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #202124;
  margin: 4px 0;
  padding: 4px;
  white-space: pre-wrap;
}
.has-more { color: #7e7e7e; }
</style>
