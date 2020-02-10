<template>
  <main id="data">
    <div id="data-navigator" v-if="loaded">
      <m-icon-button :disabled="prevSubmissionDisabled" icon="chevron_left" @click="prevSubmission" />
      <span class="submission-count" v-if="submissionIds.length > 0">
        <span id="submission-index"><m-text-field
          outlined
          v-model="currentSubmissionIndexPlusOne"
          type="number"
          min="1"
          :max="submissionIds.length"
          step="1"
        >
          <m-line-ripple slot="bottomLine" />
        </m-text-field></span> / {{submissionIds.length}} {{$t('plugin-ess.data.submissionCount')}}
      </span>
      <span class="no-submissions" v-else>{{$t('plugin-ess.data.noSubmissions')}}</span>
      <m-icon-button :disabled="nextSubmissionDisabled" icon="chevron_right" @click="nextSubmission" />
    </div>
    <div id="response" v-if="loaded && currentSubmission && !submissionLoading">
      <div class="submission-meta">
        <p class="submission-id">{{$t('plugin-ess.data.submissionId')}}{{currentSubmissionId}}</p>
        <p class="submission-time">{{$t('plugin-ess.data.submissionTime')}}{{currentSubmission.time.toLocaleString()}}</p>
      </div>
      <Question
        v-for="question in questions"
        readonly
        :key="question.id"
        :data="{ ...question, value: currentSubmission.data[question.id] }"
      />
    </div>
    <div v-else-if="loadError">{{$t('plugin-ess.data.loadError')}}</div>
    <div v-else-if="!loaded || submissionLoading">{{$t('plugin-ess.data.loading')}}</div>
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

.submission-id, .submission-time {
  text-align: center;
  margin: 0;
}

.submission-meta {
  margin-top: 8px;
}
</style>

<style>
#submission-index > .mdc-text-field {
  width: 90px;
}
</style>

<script>
import { query } from '../common/graphql'
import questionsNeeded from './questionsNeeded'
import hooks from './hooks'
import Question from './components/Question.vue'

export default {
  name: 'Data',
  mixins: [ questionsNeeded ],
  components: { Question },
  data () {
    return {
      currentSubmission: null,
      currentSubmissionIndex: -1,
      currentSubmissionIndexPlusOne: '0',
      loaded: false,
      loadError: false,
      submissionLoading: false,
      submissionIds: [],
      submissions: [],
    }
  },
  watch: {
    currentSubmissionIndex (val) {
      this.currentSubmissionIndexPlusOne = String(val + 1)
      this.updateSubmissionStatus()
    },
    currentSubmissionIndexPlusOne (val, old) {
      const num = Number(val)
      if (num !== Math.floor(val) || num < 1 || num > this.submissionIds.length) return
      this.currentSubmissionIndex = num - 1
    },
  },
  computed: {
    prevSubmissionDisabled () {
      return this.submissionIds.length === 0 || this.currentSubmissionIndex === 0
    },
    nextSubmissionDisabled () {
      return this.submissionIds.length === 0 || this.currentSubmissionIndex === this.submissionIds.length - 1
    },
    currentSubmissionId () {
      return (this.submissionIds || [])[this.currentSubmissionIndex] || null
    },
  },
  methods: {
    prevSubmission () {
      if (this.prevSubmissionDisabled) return
      this.currentSubmissionIndex--
    },
    nextSubmission () {
      if (this.nextSubmissionDisabled) return
      this.currentSubmissionIndex++
    },
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
