import Question from '../../../question'

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
      options.id = Math.max(...ctx.state.form.questions.map(q => q.options.id)) + 1
      ctx.state.form.pages[pageId].options.questions.push(new Question(options))
      await ctx.state.form.save()
      return true
    } catch(e) {
      console.log(e)
      return false
    }
  },
}
