<template>
  <main>
    <template v-if="loaded && stats">
      <DataNavigator
        count-label="plugin.ess.editor.pageCount"
        null-label="plugin.ess.editor.questionLoading"
        :count="pageCount"
        :current.sync="currentPageId"
      />
      <Question
        v-for="question in questions"
        route="stats"
        :key="question.id"
        :data="question"
        :stats="stats[question.id]"
      />
    </template>
    <m-typo-body :level="1" v-else-if="loaded && !stats">{{ $t('plugin.ess.stats.noStats') }}</m-typo-body>
    <div v-else-if="loadError">{{ $t('plugin.ess.stats.loadError') }}</div>
    <div v-else>{{ $t('plugin.ess.stats.loading') }}</div>
  </main>
</template>

<style scoped>
main { padding: 16px; }
hr {
  height: 0;
  color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  width: 100%;
  margin-bottom: 16px;
}
.block {
  display: block;
  margin: 0 12px;
}
</style>

<style>
.echarts.vote-chart {
  width: 400px;
  height: 300px;
}
</style>

<script>
import hooks from './hooks'
import { injectScript, query, waitUntil } from '@vote/api'
import questionsNeeded from './questionsNeeded'
import Question from './components/Question.vue'
import DataNavigator from './components/DataNavigator.vue'

export default {
  name: 'Stats',
  mixins: [ questionsNeeded ],
  components: { Question, DataNavigator },
  data () {
    return {
      loaded: false,
      loadError: false,
      stats: null,
    }
  },
  methods: {
    async init () {
      try {
        // echarts costs 400K+, lazyload it
        injectScript('https://cdn.jsdelivr.net/npm/echarts@4.6.0/dist/echarts.common.min.js')
        await waitUntil(() => 'echarts' in window, 300000)
        // injecting VueECharts before echarts load would result in error, so we need to load them in order
        injectScript('https://cdn.jsdelivr.net/npm/vue-echarts@4.1.0/dist/vue-echarts.js')
        await waitUntil(() => 'VueECharts' in window, 300000)
        Vue.component('v-chart', window.VueECharts)
        await this.load()
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async load () {
      try {
        await Promise.all([ this.loadQuestions(), this.loadStats() ])
        return this.loaded = true
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async loadStats () {
      const res = await query('{ stats }', {})
      if (res.errors) throw res
      this.stats = JSON.parse(res.data.stats)
    },
  },
  mounted () {
    /**
     * Fn component mounted event.
     * @event editor.editor:statsMounted
     * @type {editor:Stats}
     */
    hooks.emit('editor:statsMounted', this)
    this.init()
  },
}
</script>
