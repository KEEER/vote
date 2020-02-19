/** @module form */
import Question from './question'
import plugins from './plugin'
import themes from './theme'
import { query, update } from './db'
import logger from './log'
import fs from 'fs-extra'
import { readFileSync } from 'fs'
import path from 'path'
import EventEmitter from 'emittery'

const log = logger.child({ part: 'form' })

const templateCache = {}, jsCache = {}
themes.forEach(theme => {
  const filename = path.resolve(__dirname, '..', 'dist', `${theme.config.entryName}.html`)
  templateCache[theme.config.code] = readFileSync(filename).toString()
})
const loadPluginScript = fs.readFileSync(path.resolve(__dirname, 'loadPlugins.js')).toString()

try {
  fs.readdirSync(path.resolve(__dirname, '../dist/js'))
    .forEach(filename => {
      if (!filename.endsWith('.js')) return // do not cache .js.map files
      const realFilename = path.resolve(__dirname, '../dist/js', filename)
      jsCache[filename] = readFileSync(realFilename).toString()
    })
} catch (e) {
  throw new Error(`Error reading JS build directory: ${e}`)
}

export { templateCache, jsCache }

/** Class representing a page. */
export class Page {
  /**
   * Creates a page object.
   * @param {Object} options Options, see below.
   * @param {number} options.id Page ID
   * @param {module:question~Question[]} options.questions Questions in the page
   */
  constructor (options) {
    this.is = 'Page'
    this.options = new Proxy(options, {
      set: (obj, prop, val) => {
        obj[prop] = val
        this.updated = true
        return true
      },
    })
  }

  /**
   * Get a object to be stored.
   * @returns {object} Object representing the page
   */
  toObject () {
    return {
      title: this.options.title,
      id: this.options.id,
      questions: this.options.questions.map(q => q.id),
    }
  }

  static fromObject (pages, questions) {
    return pages.map(p => {
      const data = Object.assign({}, p)
      // handle NULL pages
      data.questions = (data.questions || []).map(q => questions.find(q_ => q_.id === q))
      return new Page(data)
    })
  }
}

/** Class representing a form. */
export class Form extends EventEmitter {
  /**
   * Creates a form object.
   * @param {object} options Options, see below.
   * @param {string} options.title The title of the form
   * @param {string} options.id Form ID
   * @param {Page[]} options.pages Pages in the form
   * @param {string} options.userid KEEER ID of the owner
   * @param {string} options.theme Form theme
   * @param {Plugin[]} [options.plugins] Plugins used in the form
   * @param {object} [options.data] Form data
   * @example const f = new Form({title: 'title', id: 'Alan-Liang/test', userid: 'Alan-Liang', theme: 'basic', plugins: [plugins.find(v => v.config.code === 'ess')], pages: [new Page({title: 'title', id: 0, questions: [new Question({type: 'VText', title: '2', id: 1, value: '2'})]})]})
   */
  constructor (options) {
    super()
    this.updated = []
    this.options = new Proxy(options, {
      set: (obj, prop, val) => {
        if (prop === 'id') {
          this.oldid = this.oldid || this.id
        }
        if (this.updated.indexOf(prop) < 0) this.updated.push(prop)
        obj[prop] = val
        return true
      },
    })
    this.options.pages = new Proxy(Form.processPages(this.options.pages), {
      set: (obj, prop, val) => {
        obj[prop] = val
        if (this.updated.indexOf('pages') < 0) this.updated.push('pages')
        return true
      },
    })
    const questions = this.options.questions
    if (questions) this.options.questions = new Proxy(questions, {
      set: (obj, prop, val) => {
        obj[prop] = val
        if (this.updated.indexOf('questions') < 0) this.updated.push('questions')
        return true
      },
    })
    if (this.options.plugins) {
      this.options.plugins.forEach(plugin => {
        plugin.attachTo(this)
      })
      const plugins = this.options.plugins
      this.options.plugins = new Proxy(plugins, {
        set: (obj, prop, val) => {
          obj[prop] = val
          if (this.updated.indexOf('plugins') < 0) this.updated.push('plugins')
          return true
        },
      })
    }
  }

  get id () {
    return this.options.id
  }
  set id (id) {
    this.options.id = id
  }

  /**
   * Gets the pages in the form.
   * @returns {Page} Pages
   */
  get pages () {
    return this.options.pages
  }

  /**
   * Removes all blank pages, unless there is only one page.
   * @param {Page[]} pages pages to be processed
   * @returns {Page[]} filtered pages
   */
  static processPages (pages) {
    const aPages = pages.filter(p => p.options && p.options.questions && p.options.questions.length > 0)
    if (aPages.length === 0) aPages.push(new Page({ id: 0, questions: [] }))
    return aPages
  }

  /**
   * Gets the questions in the form.
   * @returns {module:question~Question[]} Questions
   */
  get questions () {
    return this.pages.flatMap(p => p.options.questions)
  }

  /**
   * Converts a DB object to a Form object.
   * @param {*} data the object from the database
   * @returns {Form} the form object
   * @private
   */
  static async _fromDb (data) {
    data.questions = data.questions.map(q => new Question(q))
    data.pages = Page.fromObject(data.pages, data.questions)
    data.plugins = data.plugins.map(
      p => plugins.find(plugin => plugin.config.code === p)
    ).filter(p => !!p)
    const form = new Form(data)
    form.saved = true
    return form
  }

  /**
   * Gets a form by a certain id.
   * @param {string|number} id Form ID
   * @returns {Form} the form object
   */
  static async fromId (id) {
    const res = await query('SELECT * FROM PRE_forms WHERE id = $1;', [ id.toString() ])
    if (res.rows.length > 1) {
      log.error('form.fromId: duplicate IDs')
      throw new Error('form.fromId: duplicate IDs')
    }
    if (res.rows.length === 0) {
      return null
    }
    return await Form._fromDb(res.rows[0])
  }

  /**
   * Gets the forms of a certain user.
   * @param {string} userid the user's KEEER ID
   * @returns {Form[]} form objects
   */
  static async fromUserId (userid) {
    const res = await query('SELECT * FROM PRE_forms WHERE userid = $1;', [ userid ])
    return await Promise.all(res.rows.map(d => Form._fromDb(d)))
  }

  /** Gets parameters for saving into database. */
  get params () {
    return [
      this.id,
      this.options.userid,
      this.options.title,
      this.pages.map(p => p.toObject()),
      this.questions.map(q => q.toObject()),
      this.options.theme,
      this.options.plugins.map(p => p.config.code),
      this.options.data,
    ]
  }

  /** Updates a form in database. */
  async update () {
    if (!this.saved) {
      await this.save()
      return
    }
    const args = {}
    if (this.questions.some(q => q.updated) || this.updated.indexOf('plugins') > -1) {
      args.questions = this.questions.map(q => q.toObject())
    }
    if (this.pages.some(p => p.updated) || this.updated.indexOf('pages') > -1) {
      args.pages = Form.processPages(this.pages).map(p => p.toObject())
    }
    if (this.updated.indexOf('plugins') > -1) {
      args.plugins = this.options.plugins.map(p => p.config.code)
    }
    this.updated.filter(prop => [ 'pages', 'plugins', 'questions' ].indexOf(prop) < 0)
      .forEach(prop => args[prop] = this.options[prop])
    this.updated.length = 0
    await update('PRE_forms', args, 'id', this.oldid || this.id)
    this.questions.forEach(q => q.updated = false)
    this.pages.forEach(p => p.updated = false)
  }

  /** Saves a form into the database. */
  async save () {
    if (this.saved) {
      await this.update()
      return
    }
    const stmt = 'INSERT INTO PRE_forms (id, userid, title, pages, questions, theme, plugins, data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);'
    await query(stmt, this.params)
  }

  async destroy () {
    if (!this.saved) return
    await query('DELETE FROM PRE_forms WHERE id = $1;', [ this.id ])
    this.saved = false
  }

  /**
   * Get the HTML markup corresponding to the form.
   * @returns {string} HTML
   */
  async getHtml () {
    return (templateCache[this.options.theme]
      .replace(
        /\/vote-config.js/g,
        `/${this.id}/_bundle`
      ))
  }

  /**
   * Bundles a form to a JS script.
   * @param {string} action The action of the form
   * @param {string} method Must be 'POST', reserved for future use
   * @param {string} [key] which injection
   * @returns {string} Bundled form
   */
  async bundle (action, method, key = 'form') {
    const data = {
      title: this.options.title,
      action,
      method,
      theme: this.options.theme,
      themeConfig: themes.find(t => t.config.code === this.options.theme),
      data: this.pages.map(page => page.options.questions.map(q => q.toObject())),
      config: this.options.data,
      pluginJs: [],
      pluginCss: [],
    }
    if (this.options.plugins) {
      this.options.plugins.forEach(plugin => {
        if (plugin.config.inject[key].jsPath) data.pluginJs.push('/js/' + plugin.config.inject[key].jsPath)
        if (plugin.config.inject[key].cssPath) data.pluginCss.push('/css/' + plugin.config.inject[key].cssPath)
      })
    }
    await this.emit('bundle', [ this, data, action, method, key ])
    return '(function(){ window.KVoteFormData = ' +
      JSON.stringify(data) + ';' +
      loadPluginScript + '})()'
  }

  /**
   * Get a page corresponding to the relative URL.
   * @param {string} path The requested path
   * @param {Koa.context} ctx The Koa context
   * @returns {string|number} The response to be sent or the error to be thrown
   * @example await form.getPage('fill', ctx)
   */
  async getPage (path, ctx) {
    let res = null
    await this.emit('getPage', [ path, ctx, r => res = r ])
    if (res !== null) {
      if (res === 200) return ''
      if (typeof res === 'number') return ctx.throw(res)
      if (typeof res === 'string' || Buffer.isBuffer(res)) return res
      log.error(`typeof html is ${typeof res}`)
      return ctx.throw(500)
    }

    switch (path) {
    case '':
    case 'fill':
      return await this.getHtml()

    case '_bundle':
      return await this.bundle(`/${this.id}/_submit`, 'POST')

    case '_submit':
      return await this.handleSubmission(ctx)

    default:
      return 404
    }
  }

  /**
   * Handles a submission entry.
   * @param {Koa.Context} ctx Koa context
   */
  async handleSubmission (ctx) {
    let res
    await this.emit('handleSubmission', [ ctx, r => res = r ])
    if (res) return res

    if (ctx.method !== 'POST') {
      return 405 // Method Not Allowed
    }
    if (!ctx.request.body) {
      return 400
    }

    let data = ctx.request.body
    if (Array.isArray(data)) {
      data = {}
      ctx.request.body.forEach((v, i) => data[i] = v)
    }

    await query('INSERT INTO PRE_submissions (formid, data) VALUES ($1, $2);', [ this.id, data ])
    return 200
  }

  /** Gets submissions of the form. */
  async getSubmissions () {
    const res = (await query('SELECT * FROM PRE_submissions WHERE formid = $1;', [ this.id ])).rows
    await this.emit('getSubmissions', [ this, res ])
    return res
  }

  /** Gets submission IDs of the form. */
  async getSubmissionIds () {
    const res = (await query('SELECT id FROM PRE_submissions WHERE formid = $1;', [ this.id ])).rows.map(r => r.id)
    await this.emit('getSubmissionIds', [ this, res ])
    return res
  }

  /**
   * Gets submission from given ID.
   * @param {string} id submission ID
   */
  async submissionFromId (id) {
    const res = (await query('SELECT * FROM PRE_submissions WHERE formid = $1 AND id = $2;', [ this.id, id ])).rows[0]
    return res || null
  }
}
