/** @module form */
import Question from './question'
import plugins from './plugin'
import themes from './theme'
import {query, update} from './db'
import log from './log'
import fs from 'fs-extra'
import {readFileSync} from 'fs'
import path from 'path'
import EventEmitter from 'emittery'

const templateCache = {}, jsCache = {}
themes.forEach(theme => {
  const filename = path.resolve(__dirname, '..', 'dist', `${theme.config.entryName}.html`)
  templateCache[theme.config.code] = readFileSync(filename).toString()
})
const loadPluginScript = fs.readFileSync(path.resolve(__dirname, 'loadPlugins.js')).toString()

try {
  fs.readdirSync(path.resolve(__dirname, '../dist/js'))
    .forEach(filename => {
      if(!filename.endsWith('.js')) return // do not cache .js.map files
      const realFilename = path.resolve(__dirname, '../dist/js', filename)
      jsCache[filename] = readFileSync(realFilename).toString()
    })
} catch(e) {
  throw new Error(`Error reading JS build directory: ${e}`)
}

export {templateCache, jsCache}

/** Class representing a page. */
export class Page {
  /**
   * Creates a page object.
   * @param {Object} options Options, see below.
   * @param {string} options.title The title of the page
   * @param {string} options.id Page ID
   * @param {module:question~Question[]} options.questions Questions in the page
   */
  constructor(options) {
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
  toObject() {
    return {
      title: this.options.title,
      id: this.options.id,
      questions: this.options.questions.map(q => q.id),
    }
  }

  static fromObject(pages, questions) {
    return pages.map(p => {
      const data = Object.assign({}, p)
      data.questions = data.questions.map(q => questions.find(q_ => q_.id === q))
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
   * @param {string|number} options.id Form ID
   * @param {Page[]} options.pages Pages in the form
   * @param {string} options.userid KEEER ID of the owner
   * @param {string} options.theme Form theme
   * @param {string[]} [options.plugins] Plugins used in the form
   * @param {object} [options.data] Form data
   */
  constructor(options) {
    super()
    this.updated = []
    this.options = new Proxy(options, {
      set: (obj, prop, val) => {
        if(prop === 'id') {
          this.oldid = this.oldid || this.id
        }
        if(this.updated.indexOf(prop) < 0) this.updated.push(prop)
        obj[prop] = val
        return true
      },
    })
    const pages = this.options.pages
    this.options.pages = new Proxy(pages, {
      set: (obj, prop, val) => {
        obj[prop] = val
        if(this.updated.indexOf('pages') < 0) this.updated.push('pages')
        return true
      },
    })
    const questions = this.options.questions
    this.options.questions = new Proxy(questions, {
      set: (obj, prop, val) => {
        obj[prop] = val
        if(this.updated.indexOf('questions') < 0) this.updated.push('questions')
        return true
      },
    })
    if(this.options.plugins) {
      this.options.plugins.forEach(plugin => {
        plugin.attachTo(this)
      })
      const plugins = this.options.plugins
      this.options.plugins = new Proxy(plugins, {
        set: (obj, prop, val) => {
          obj[prop] = val
          if(this.updated.indexOf('plugins') < 0) this.updated.push('plugins')
          return true
        },
      })
    }
  }

  get id() {
    return this.options.id
  }
  set id(id) {
    this.options.id = id
  }

  /**
   * Gets the pages in the form.
   * @returns {Page} Pages
   */
  get pages() {
    return this.options.pages
  }

  /**
   * Gets the questions in the form.
   * @returns {module:question~Question[]} Questions
   */
  get questions() {
    return this.pages.flatMap(p => p.options.questions)
  }

  /**
   * Gets a form by a certain id.
   * @param {string|number} id Form ID
   */
  static async fromId(id) {
    const res = await query('SELECT * FROM PRE_forms WHERE id = $1;', [id.toString()])
    if(res.rows.length > 1) {
      log.error('form.fromId: duplicate IDs')
      throw new Error('form.fromId: duplicate IDs')
    }
    if(res.rows.length === 0) {
      return null
    }
    const data = res.rows[0]
    data.questions = data.questions.map(q => new Question(q))
    data.pages = Page.fromObject(data.pages, data.questions)
    data.plugins = data.plugins.map(
      p => plugins.find(plugin => plugin.config.code === p)
    ).filter(p => !!p)
    const form = new Form(data)
    form.saved = true
    return form
  }

  /** Gets parameters for saving into database. */
  get params() {
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
  async update() {
    if(!this.saved) {
      await this.save()
      return
    }
    const args = {}
    if(this.questions.some(q => q.updated) || this.updated.indexOf('plugins') > -1) {
      args.questions = this.questions.map(q => q.toObject())
    }
    if(this.pages.some(p => p.updated) || this.updated.indexOf('pages') > -1) {
      args.pages = this.pages.map(p => p.toObject())
    }
    if(this.updated.indexOf('plugins') > -1) {
      args.plugins = this.options.plugins.map(p => p.config.code)
    }
    this.updated.filter(prop => ['pages', 'plugins', 'questions'].indexOf(prop) < 0)
      .forEach(prop => args[prop] = this.options[prop])
    this.updated.length = 0
    await update('PRE_forms', args, 'id', this.oldid || this.id)
    this.questions.forEach(q => q.updated = false)
    this.pages.forEach(p => p.updated = false)
  }

  /** Saves a form into the database. */
  async save() {
    if(this.saved) {
      await this.update()
      return
    }
    const stmt = 'INSERT INTO PRE_forms (id, userid, title, pages, questions, theme, plugins, data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);'
    await query(stmt, this.params)
  }

  /** 
   * Get the HTML markup corresponding to the form.
   * @returns {string} HTML
   */
  async getHtml() {
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
   * @returns {string} Bundled form
   */
  async bundle(action, method) {
    const data = {
      title: this.options.title,
      action,
      method,
      data: this.pages.map(page => page.options.questions.map(q => q.toObject())),
      pluginJs: [],
      pluginCss: [],
    }
    if(this.options.plugins) {
      this.options.plugins.forEach(plugin => {
        if(plugin.config.jsPath) data.pluginJs.push('/js/' + plugin.config.jsPath)
        if(plugin.config.cssPath) data.pluginCss.push('/css/' + plugin.config.cssPath)
      })
    }
    await this.emit('bundle', [data])
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
  async getPage(path, ctx) {
    let html = null
    await this.emit('getPage', [path, ctx, h => html = h])
    if(html !== null) return html

    switch(path) {
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
  async handleSubmission(ctx) {
    let res
    this.emit('handleSubmission', [ctx, r => res = r])
    if(res) return res

    if(ctx.method !== 'POST') {
      return 405 // Method Not Allowed
    }
    if(!ctx.request.body) {
      return 400
    }

    let data = ctx.request.body
    if(Array.isArray(data)) {
      data = {}
      ctx.request.body.forEach((v, i) => data[i] = v)
    }

    await query('INSERT INTO submissions (formid, data) VALUES ($1, $2);', [this.id, data])
    return 200
  }
}
