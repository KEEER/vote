import { query } from '../common/graphql'

export default {
  data () {
    return {
      pages: [],
      questions: [],
      pageCount: 0,
      currentPageId: 0,
      questionLoaded: false,
      questionLoadError: false,
    }
  },
  watch: {
    currentPageId () { this.loadQuestions() },
  },
  methods: {
    async loadQuestions () {
      if (this.currentPageId in this.pages) {
        this.questions = this.pages[this.currentPageId]
        return
      }
      this.questionLoaded = false
      const id = this.currentPageId
      try {
        const res = await query(`
          query($id: Int!) {
            form {
              page(id: $id) {
                questions { type, title, description, id, value, required, options, config }
              }
              pageCount
            }
          }`.trim(), { id })
        if (res.errors) throw res
        this.questions = res.data.form.page.questions
        for (const i of [ 'value', 'options', 'description', 'config' ]) {
          for (const question of this.questions) {
            question[i] = JSON.parse(question[i])
          }
        }
        this.pages[id] = this.questions
        // Do not replace it with `this.pageCount === undefined`
        if (!this.pageCount) this.pageCount = res.data.form.pageCount
        this.questionLoaded = true
      } catch (e) {
        console.error('loadQuestions', e)
        this.questionLoadError = true
        throw e
      }
    },
  },
  provides () {
    return { questionsInstance: this }
  },
}
