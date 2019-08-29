import Question from '../../../question'
import log from '../../../log'
import assert from 'assert'

export default {
  async form(args, ctx) {
    const form = Object.assign({}, ctx.state.form.options)
    form.pages = form.pages.map(p => Object.assign({}, p.options))
    form.pages.forEach(p => {
      p.questions = p.questions.map(q => q.toObject())
    })
    form.plugins = form.plugins.map(p => p.config.code)
    return form
  },
  async newQuestion({pageId, options}, ctx) {
    try {
      options.id = ctx.state.form.questions.map(q => q.options.id).reduce((m, n) => m > n ? m : n, 0)
      ctx.state.form.pages[pageId].options.questions.push(new Question(options))
      await ctx.state.form.update()
      return true
    } catch(e) {
      log.error(e)
      return false
    }
  },
  async updateQuestion({options}, ctx) {
    try {
      const q = ctx.state.form.questions.find(q => q.options.id === options.id)
      if(options.reorder) {
        const {reorder} = options
        delete options.reorder
        assert(typeof reorder, 'number')
        const page = ctx.state.form.pages.find(p => p.options.questions.includes(q))
        const questions = page.options.questions
        const i = questions.indexOf(q)
        assert(!!questions[i + reorder])
        ;[questions[i + reorder], questions[i]] = [questions[i], questions[i + reorder]]
      }
      Object.assign(q.options, options)
      await ctx.state.form.update()
      return true
    } catch(e) {
      log.error(e)
      return false
    }
  },
  async removeQuestion({id}, ctx) {
    try {
      const q = ctx.state.form.questions.find(q => q.options.id === id)
      const p = ctx.state.form.pages.find(p => p.options.questions.includes(q))
      p.options.questions.splice(p.options.questions.indexOf(q), 1)
      await ctx.state.form.update()
      return true
    } catch(e) {
      log.error(e)
      return false
    }
  },
}
