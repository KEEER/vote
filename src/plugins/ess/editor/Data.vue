<template>
  <main id="data">
    <DataNavigator
      count-label="plugin.ess.data.submissionCount"
      null-label="plugin.ess.data.noSubmissions"
      :count="submissionIds.length"
      :current.sync="currentSubmissionIndex"
      v-if="loaded"
    />
    <div id="response" v-if="loaded && currentSubmission && !submissionLoading">
      <div class="submission-meta">
        <p class="submission-id">{{$t('plugin.ess.data.submissionId')}}{{currentSubmissionId}}</p>
        <p class="submission-time">{{$t('plugin.ess.data.submissionTime')}}{{currentSubmission.time.toLocaleString()}}</p>
      </div>
      <DataNavigator
        count-label="plugin.ess.editor.pageCount"
        null-label="plugin.ess.editor.questionLoading"
        :count="pageCount"
        :current.sync="currentPageId"
      />
      <Question
        v-for="question in questions"
        readonly
        :key="question.id"
        :data="{ ...question, value: currentSubmission.data[question.id] }"
      />
    </div>
    <div v-else-if="loadError">{{$t('plugin.ess.data.loadError')}}</div>
    <div v-else-if="!loaded || submissionLoading">{{$t('plugin.ess.data.loading')}}</div>
  </main>
</template>

<style scoped>
main {
  padding: 10px;
  overflow: hidden;
  overflow-wrap: break-word;
}
.submission-id, .submission-time {
  text-align: center;
  margin: 0;
}
.submission-meta {
  margin: 8px 0;
}
</style>

<script>
import { query } from '../common/graphql'
import questionsNeeded from './questionsNeeded'
import hooks from './hooks'
import Question from './components/Question.vue'
import DataNavigator from './components/DataNavigator.vue'

export default {
  name: 'Data',
  mixins: [ questionsNeeded ],
  components: { Question, DataNavigator },
  data () {
    return {
      currentSubmission: null,
      currentSubmissionIndex: -1,
      loaded: false,
      loadError: false,
      submissionLoading: false,
      submissionIds: [],
      submissions: [],
    }
  },
  watch: {
    currentSubmissionIndex () { this.updateSubmissionStatus() },
  },
  computed: {
    currentSubmissionId () {
      return (this.submissionIds || [])[this.currentSubmissionIndex] || null
    },
  },
  methods: {
    async updateSubmissionStatus () {
      try {
        this.submissionLoading = true
        await this.loadSubmission()
        return this.submissionLoading = false
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async load () {
      try {
        await this.loadQuestions()
        await this.loadSubmissionIds()
        return this.loaded = true
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async loadSubmissionIds () {
      const res = await query('{ submissionIds }', {})
      if (res.errors) throw res
      this.submissionIds = res.data.submissionIds
      if (this.currentSubmissionId === null && this.submissionIds.length !== 0) {
        this.currentSubmissionIndex = 0
      }
    },
    async loadSubmission (id = this.currentSubmissionId) {
      if (!id || id === null) return null
      const inCache = this.submissions.find(s => s.id === id)
      if (inCache) return this.currentSubmission = inCache
      const res = await query('query($id: String!) { submission(id: $id) { data, time } }', { id })
      if (res.errors) throw res
      const submission = res.data.submission
      submission.time = new Date(Number(submission.time))
      submission.id = id
      submission.data = JSON.parse(submission.data || '{}')
      this.currentSubmission = submission
      this.submissions.push(submission)
      return submission
    },
  },
  mounted () {
    hooks.emit('editor:dataMounted', [ this ])
    this.load()
  },
}
</script>
