import Question from '../../../question'
import log from '../../../log'
import assert from 'assert'
import sanitize from 'sanitize-html'
import { themes } from '../../../theme'

export default {
  async form (args, ctx) {
    const form = Object.assign({}, ctx.state.form.options)
    form.pages = form.pages.map(p => Object.assign({}, p.options))
    form.pages.forEach(p => {
      p.questions = p.questions.map(q => {
        const o = q.toObject()
        for (let i of [ 'value', 'options', 'description', 'config' ]) {
          o[i] = JSON.stringify(o[i])
        }
        return o
      })
    })
    form.plugins = form.plugins.map(p => p.config.code)
    form.page = ({ id }) => form.pages[id]
    form.pageCount = form.pages.length
    form.themeConfig = JSON.stringify(themes.find(t => t.config.code === form.theme))
    let formData = form.data || {}
    await ctx.state.form.emit('preprocessData', [ ctx.state.form, formData, d => formData = d ])
    form.data = JSON.stringify(formData)
    return form
  },
  async submission ({ id }, ctx) {
    const res = await ctx.state.form.submissionFromId(id)
    if (!res) return null
    res.data = JSON.stringify(res.data)
    return res
  },
  async submissionIds (_args, ctx) {
    return await ctx.state.form.getSubmissionIds()
  },
  async newQuestion ({ pageId, options }, ctx) {
    try {
      options.id = ctx.state.form.questions.map(q => q.options.id).reduce((m, n) => Math.max(m, n), -1) + 1
      ctx.state.form.pages[pageId].options.questions.push(new Question(options))
      await ctx.state.form.update()
      return options.id
    } catch (e) {
      log.error(e)
      throw new Error('Failed to create question')
    }
  },
  async updateQuestion ({ options }, ctx) {
    try {
      const q = ctx.state.form.questions.find(q => q.options.id === options.id)
      if (options.reorder) {
        const { reorder } = options
        delete options.reorder
        assert(typeof reorder, 'number')
        const page = ctx.state.form.pages.find(p => p.options.questions.includes(q))
        const questions = page.options.questions
        const i = questions.indexOf(q)
        assert(!!questions[i + reorder])
        ;[ questions[i + reorder], questions[i] ] = [ questions[i], questions[i + reorder] ]
      }
      for (let i of [ 'value', 'options', 'description', 'config' ]) {
        if (i in options) {
          options[i] = JSON.parse(options[i])
        }
      }
      if ('description' in options) {
        const desc = (options.description || {}).html || ''
        options.description = { html: sanitize(desc, {
          allowedIframeHostnames: [],
          transformTags: {
            a: sanitize.simpleTransform('a', { target: '_blank', rel: 'noopener nofollow' }),
          },
        }) }
      }
      Object.assign(q.options, options)
      await ctx.state.form.update()
      return true
    } catch (e) {
      log.error(e)
      return false
    }
  },
  async removeQuestion ({ id }, ctx) {
    try {
      const q = ctx.state.form.questions.find(q => q.options.id === id)
      const p = ctx.state.form.pages.find(p => p.options.questions.includes(q))
      p.options.questions.splice(p.options.questions.indexOf(q), 1)
      await ctx.state.form.update()
      return true
    } catch (e) {
      log.error(e)
      return false
    }
  },
  async updateSettings ({ name, value }, ctx) {
    try {
      const form = ctx.state.form
      let retval
      await form.emit('updateSettings', [ form, name, value, ret => retval = ret ])
      if (typeof retval === 'boolean') return retval
      if (retval !== undefined) value = retval
      const data = form.options.data || {}
      data.settings = data.settings || {}
      data.settings[name] = value
      // save form
      form.options.data = data
      await form.update()
      return true
    } catch (e) {
      log.error(e)
      return false
    }
  },
}
