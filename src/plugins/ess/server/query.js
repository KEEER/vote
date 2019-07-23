export default {
  async form(parent, ctx) {
    const form = Object.assign({}, ctx.state.form.options)
    form.pages = form.pages.map(p => Object.assign({}, p.options))
    form.pages.forEach(p => {
      p.questions = p.questions.map(q => q.toObject())
    })
    form.plugins = form.plugins.map(p => p.config.code)
    return form
  },
}
