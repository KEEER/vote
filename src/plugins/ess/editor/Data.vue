<template>
  <main id="data">
    <div id="data-navigator" v-if="loaded">
      <m-icon-button :disabled="prevSubmissionDisabled" icon="chevron_left" @click="prevSubmission" />
      <span class="submission-count" v-if="submissionIds.length > 0">{{submissionIds.indexOf(currentSubmissionId) + 1}} / {{submissionIds.length}} {{texts.submissionCount}}</span>
      <span class="no-submissions" v-else>{{texts.noSubmissions}}</span>
      <m-icon-button :disabled="nextSubmissionDisabled" icon="chevron_right" @click="nextSubmission" />
    </div>
    <div id="response" v-if="loaded">
      <Question
        v-for="question in questions"
        readonly
        :key="question.id"
        :data="{ ...question, value: currentSubmission.data[question.id] }"
        :texts="texts"
      />
    </div>
    <div v-else-if="loadError">{{texts.loadError}}</div>
    <div v-else>{{texts.loading}}</div>
  </main>
</template>

<style scoped>
main {
  padding: 10px;
}

#data-navigator {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-content: baseline;
}

.submission-count, .no-submissions {
  align-self: center;
}
</style>

<script>
import { query } from '../common/graphql'
import questionsNeeded from './questionsNeeded'
import hooks from './hooks'
import Question from './components/Question.vue'
import questionTexts from './questionTexts'

export default {
  name: 'Data',
  mixins: [ questionsNeeded ],
  components: { Question },
  data () {
    return {
      currentSubmission: null,
      currentSubmissionId: -1,
      loaded: false,
      loadError: false,
      submissionIds: [],
      submissions: [],
      texts: {
        loading: 'Loading data...',
        loadError: 'Data loading failed.',
        submissionCount: 'Submission(s)',
        noSubmissions: 'No submissions.',
        question: questionTexts,
      },
    }
  },
  computed: {
    prevSubmissionDisabled () {
      return this.submissionIds.length === 0 || this.submissionIds[0] === this.currentSubmissionId
    },
    nextSubmissionDisabled () {
      return this.submissionIds.length === 0 || this.submissionIds[this.submissionIds.length - 1] === this.currentSubmissionId
    },
  },
  methods: {
    async prevSubmission () {
      try {
        const i = this.submissionIds.indexOf(this.currentSubmissionId)
        if (i === 0) return
        this.loaded = false
        this.currentSubmissionId = this.submissionIds[i - 1]
        await this.loadSubmission()
        return this.loaded = true
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async nextSubmission () {
      try {
        const i = this.submissionIds.indexOf(this.currentSubmissionId)
        if (i === this.submissionIds.length - 1) return
        this.loaded = false
        this.currentSubmissionId = this.submissionIds[i + 1]
        await this.loadSubmission()
        return this.loaded = true
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async load () {
      try {
        await this.loadQuestions()
        await this.loadSubmissionIds()
        await this.loadSubmission()
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
      if (this.currentSubmissionId === -1) this.currentSubmissionId = this.submissionIds[0] || -1
    },
    async loadSubmission (id = this.currentSubmissionId) {
      if (!id || id === -1) return null
      const inCache = this.submissions.find(s => s.id === id)
      if (inCache) return this.currentSubmission = inCache
      const res = await query('query($id: String!) { submission(id: $id) { data } }', { id })
      if (res.errors) throw res
      const submission = res.data.submission
      submission.id = id
      submission.data = JSON.parse(submission.data || '{}')
      this.currentSubmission = submission
      this.submissions.push(submission)
      return submission
    }
  },
  mounted () {
    hooks.emit('editor:dataMounted', [ this ])
    this.load()
  },
}
</script>
