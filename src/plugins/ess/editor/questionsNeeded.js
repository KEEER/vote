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
  methods: {
    async loadQuestions () {
      try {
        const res = await query(`
          query($id: Int!) {
            form {
              page(id: $id) {
                questions { type, title, description, id, value, required, options }
              }
              pageCount
            }
          }`.trim(), {
          id: this.currentPageId,
        })
        if (res.errors) throw res
        this.questions = res.data.form.page.questions
        for (let i of [ 'value', 'options', 'description' ]) {
          for (let question of this.questions) {
            question[i] = JSON.parse(question[i])
          }
        }
        this.pageCount = res.data.form.pageCount
        this.questionLoaded = true
      } catch (e) {
        console.error(e)
        this.questionLoadError = true
        throw e
      }
    },
  },
}
