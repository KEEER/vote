<template>
  <main id="data">
    Data
  </main>
</template>

<style scoped>
main {
  padding: 10px;
}
</style>

<script>
import { query } from '../common/graphql'
import questionsNeeded from './questionsNeeded'
import hooks from './hooks'

export default {
  name: 'Data',
  mixins: [ questionsNeeded ],
  data () {
    return {
      loaded: false,
      loadError: false,
      submissionIds: [],
      currentSubmissionId: -1,
      currentSubmission: null,
      submissions: [],
    }
  },
  methods: {
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
