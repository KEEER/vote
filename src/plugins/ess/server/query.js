import assert from 'assert'
import sanitize from 'sanitize-html'
import Question from '@vote/core/question'
import { Page } from '@vote/core/form'
import logger from '@vote/core/log'
import { themes } from '@vote/core/theme'
import { plugins } from '@vote/core/plugin'

const log = logger.child({ part: 'plugin-ess.query' })

export default {
  async form (args, ctx) {
    const form = Object.assign({}, ctx.state.form.options)
    form.pages = form.pages.map(p => Object.assign({}, p.options))
    form.pages.forEach(p => {
      p.questions = p.questions.map(q => {
        const o = q.toObject()
        for (const i of [ 'value', 'options', 'description', 'config' ]) {
          o[i] = JSON.stringify(o[i])
        }
        return o
      })
    })
    form.plugins = form.plugins.map(p => p.config.code)
    form.page = ({ id }) => form.pages[id] || { title: null, id, questions: [] }
    form.pageCount = form.pages.length
    form.themeConfig = JSON.stringify(themes.find(t => t.config.code === form.theme))
    let formData = form.data || {}
    /**
     * Preprocess GraphQL form query event.
     * @event Form#preprocessData
     * @type {object}
     * @property {module:form~Form} form the form itself
     * @property {object} data form data to send
     * @property {function} set setter function
     */
    await ctx.state.form.emit('preprocessData', { form: ctx.state.form, data: formData, set: d => formData = d })
    form.data = JSON.stringify(formData)
    return form
  },
  async submission ({ id }, ctx) {
    const res = await ctx.state.form.getSubmission(id)
    if (!res) return null
    res.tags = await ctx.state.form.getSubmissionTags(id, true)
    res.data = JSON.stringify(res.data)
    return res
  },
  async submissionIds (_args, ctx) {
    return await ctx.state.form.getSubmissionIds()
  },
  async submissionIdsByTag ({ tags }, ctx) {
    return await ctx.state.form.getSubmissionIdsByTags(tags)
  },
  async newQuestion ({ pageId, options }, ctx) {
    try {
      options.id = ctx.state.form.questions.map(q => q.options.id).reduce((m, n) => Math.max(m, n), -1) + 1
      if (!(pageId in ctx.state.form.pages)) ctx.state.form.pages[pageId] = new Page({ id: pageId, questions: [] })
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
      if (!q) return false
      if (options.reorder) {
        const { reorder } = options
        delete options.reorder
        assert(typeof reorder, 'number')
        const page = ctx.state.form.pages.find(p => p.options.questions.includes(q))
        const questions = page.options.questions
        const i = questions.indexOf(q)
        assert(!!questions[i + reorder])
        questions.splice(i, 1)
        questions.splice(i + reorder, 0, q)
      }
      for (const i of [ 'value', 'options', 'description', 'config' ]) {
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
      value = JSON.parse(value)
      /**
       * Update settings event.
       * @event Form#updateSettings
       * @property {module:form~Form} form the form itself
       * @property {string} name settings entry name
       * @property {any} value settings value
       * @property {function} set setter function, call with boolean to directly return true of false, else to override value
       */
      await form.emit('updateSettings', { form, name, value, set: ret => retval = ret })
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
  async updateFn ({ plugins: pluginJSON, theme }, ctx) {
    const form = ctx.state.form
    assert(typeof pluginJSON === 'string')
    assert(typeof theme === 'string')
    assert(themes.some(t => t.config.code === theme))
    const pluginCodes = JSON.parse(pluginJSON)
    assert(Array.isArray(pluginCodes))
    const pluginsUsed = pluginCodes.map(code => plugins.find(p => p.config.code === code))
    assert(pluginsUsed.every(p => !!p))
    // TODO: check pro features and compatibility
    form.options.plugins = pluginsUsed
    form.options.theme = theme
    await form.update()
    return true
  },
  async updateSubmissionTags ({ id, tags }, ctx) {
    try {
      await ctx.state.form.updateSubmissionTags(id, tags)
      return true
    } catch (e) {
      log.error(e)
      return false
    }
  },
  async stats (_args, ctx) { return JSON.stringify(await ctx.state.form.getStats()) },
}
