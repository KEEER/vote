export default {
  async form(_, ctx) {
    // TODO: resolve plugins
    return ctx.state.form.options
  },
}
