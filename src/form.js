/** @module form */
import Question from './question'
import plugins from './plugin'
import themes from './theme'
import {query} from './db'
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
   * @param {string|number} options.id Page ID
   * @param {module:question~Question[]} options.questions Questions in the page
   */
  constructor(options) {
    this.is = 'Page'
    const {
      title,
      id,
      questions,
    } = options
    this.title = title
    this.id = id
    this.questions = questions
  }

  /**
   * Get a object to be stored.
   * @returns {object} Object representing the page
   */
  toObject() {
    return {
      title: this.title,
      id: this.id,
      questions: this.questions.map(q => q.id),
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
    this.options = options
    if(this.options.plugins) {
      this.options.plugins.forEach(plugin => {
        plugin.attachTo(this)
      })
    }
  }

  get id() {
    return this.newid || this.options.id
  }
  set id(id) {
    this.newid = id
  }

  get pages() {
    return this.options.pages
  }

  /**
   * Gets the questions in the form.
   * @returns {module:question~Question[]} Questions.
   */
  get questions() {
    return this.pages.flatMap(p => p.questions)
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
    if(this.newid) {
      const newid = this.newid
      delete this.newid
      const stmt = 'UPDATE PRE_forms SET id = $2 WHERE id = $1;'
      await query(stmt, [
        this.id,
        newid,
      ])
      this.options.id = newid
    }
    const stmt = 'UPDATE PRE_forms SET userid = $2, title = $3, pages = $4, questions = $5, theme = $6, plugins = $7, data = $8 WHERE id = $1;'      
    await query(stmt, this.params)
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
      data: this.pages.map(page => page.questions.map(q => q.toObject())),
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
   * @example form.getPage('fill', ctx)
   */
  async getPage(path, ctx) {
    let html = null
    await this.emit('getPage', [path, h => html = h])
    if(html !== null) return html

    switch(path) {
    case '':
    case 'fill':
      return await this.getHtml()

    case '_bundle':
      return await this.bundle(`/${this.id}/_submit`, 'POST')

    case '_submit':
      return ''

    default:
      return 404
    }
  }

}
