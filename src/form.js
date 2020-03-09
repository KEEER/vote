/** @module form */
import Question from './question'
import plugins from './plugin'
import themes from './theme'
import { query, update } from './db'
import logger from './log'
import { readFileSync } from 'fs'
import { readDistFile } from '@vote/api'
import path from 'path'
import EventEmitter from 'emittery'

const log = logger.child({ part: 'form' })

export const templateCache = {}
for (let theme of themes) {
  templateCache[theme.config.code] = readDistFile(`${theme.config.entryName}.html`)
}
const loadPluginScript = readFileSync(path.resolve(__dirname, 'loadPlugins.js')).toString()

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
   * @param {object} options options, see below.
   * @param {string} options.title the title of the form
   * @param {string} options.name form name
   * @param {number} [options.id] internal form ID
   * @param {Page[]} options.pages pages in the form
   * @param {number} options.userId internal ID of the owner
   * @param {string} options.userName KEEER ID of the owner
   * @param {string} options.theme form theme
   * @param {Plugin[]} [options.plugins] plugins used in the form
   * @param {object} [options.data] form data
   */
  constructor (options) {
    super()
    this.updated = []
    this.options = new Proxy(options, {
      set: (obj, prop, val) => {
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

  get id () { return this.options.id || null }

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
   * Gets all theme and plugins objects.
   * @private
   */
  get _themeAndPlugins () {
    return [
      ...(this.options.plugins || []),
      themes.find(t => t.config.code === this.options.theme),
    ]
  }

  /**
   * Gets all feature provided by this form.
   * @param {string} feature hooks|types|injections
   * @param {(module:theme~Theme|module:plugin~Plugin)[]} [objects] objects to check
   * @returns {string[]}
   */
  provides (feature, objects = this._themeAndPlugins) {
    return [ ...new Set(objects.flatMap(o => ((o.config.provides || {})[feature] || []))) ]
  }

  /**
   * Checks if a theme/plugin is applicable.
   * @param {module:theme~Theme|module:plugin~Plugin} obj the theme or plugin object
   * @returns {boolean}
   */
  isApplicable (obj) {
    let objectsToCheck
    if (obj.is === 'plugin') {
      if ((this.options.plugins || []).find(p => p.config.code === obj.config.code)) return true
      objectsToCheck = this._themeAndPlugins
    } else if (obj.is === 'theme') {
      if (this.options.theme === obj.config.code) return true
      objectsToCheck = this.options.plugins || []
      const thisTheme = themes.find(t => t.config.code === this.options.theme)
      if (thisTheme.config.provides) {
        for (let feature of [ 'hooks', 'types', 'injecctions' ]) {
          if (!thisTheme.config.provides[feature]) continue
          for (let plugin of objectsToCheck) {
            if (!plugin.config.uses[feature]) continue
            const allExceptThis = [ ...objectsToCheck.filter(o => o !== plugin), obj ]
            const provided = this.provides(feature, allExceptThis)
            if (plugin.config.uses[feature].some(f => provided.indexOf(f) < 0)) return false
          }
        }
      }
    } else throw new TypeError()
    if (!obj.config.uses) return true
    for (let feature of [ 'hooks', 'types', 'injections' ]) {
      if (obj.config.uses[feature]) {
        const provided = this.provides(feature, objectsToCheck)
        if (obj.config.uses[feature].some(f => provided.indexOf(f) < 0)) return false
      }
    }
    return true
  }

  /**
   * Checks if a plugin is required.
   * @param {module:plugin~Plugin} obj the plugin object
   * @returns {boolean}
   */
  isRequired (obj) {
    if (!obj.is === 'plugin') throw new TypeError()
    if (!obj.config.provides) return false
    if (!this.options.plugins || !this.options.plugins.find(p => p.config.code === obj.config.code)) return false
    const objectsToCheck = this._themeAndPlugins.filter(x => x.is !== 'plugin' || x.config.code !== obj.config.code)
    const questionTypes = this.provides('types', objectsToCheck)
    return objectsToCheck.some(o => {
      if (!o.config.uses) return false
      for (let feature of [ 'hooks', 'types', 'injections' ]) {
        if (o.config.uses[feature]) {
          const provided = this.provides(feature, objectsToCheck.filter(o1 => o1.config.code !== o.config.code))
          if (o.config.uses[feature].some(f => provided.indexOf(f) < 0)) return true
        }
      }
      return false
    }) || this.questions.some(q => questionTypes.indexOf(q.config.type) < 0)
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
    data.userId = data.user_id
    delete data.user_id
    data.userName = (await query('SELECT name FROM PRE_users WHERE id = $1;', [ data.userId ])).rows[0].name
    const form = new Form(data)
    form.saved = true
    return form
  }

  /**
   * Gets a form by a certain path.
   * @param {string} uname user name
   * @param {string} name form name
   * @returns {Form} the form object
   */
  static async fromName (uname, name) {
    const res = await query(`
      SELECT * FROM PRE_forms WHERE user_id = (
        SELECT id FROM PRE_users WHERE lower_name = LOWER($1)
      ) AND lower_name = LOWER($2);`, [ uname.toString(), name.toString() ])
    if (res.rows.length > 1) {
      log.error('form.fromName: duplicate path')
      throw new Error('form.fromName: duplicate path')
    }
    if (res.rows.length === 0) return null
    return await Form._fromDb(res.rows[0])
  }

  /**
   * Checks if a form exists.
   * @param {number} uid user id
   * @param {string} name form name
   * @returns {boolean}
   */
  static async exists (uid, name) {
    const res = await query('SELECT id FROM PRE_forms WHERE user_id = $1 AND lower_name = LOWER($2);', [ uid, name ])
    return res.rows.length > 0
  }

  /**
   * Gets the forms of a certain user.
   * @param {string} userId the user's internal ID
   * @returns {Form[]} form objects
   */
  static async fromUserId (userId) {
    const res = await query('SELECT * FROM PRE_forms WHERE user_id = $1;', [ userId ])
    return await Promise.all(res.rows.map(d => Form._fromDb(d)))
  }

  /** Gets parameters for saving into database. */
  get params () {
    return [
      this.options.userId,
      this.options.name,
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
    if (this.updated.indexOf('name') > -1) {
      args.name = this.options.name
      args.lower_name = this.options.name.toLowerCase()
    }
    if (this.updated.indexOf('userId') > -1) {
      args.user_id = this.options.userId
    }
    this.updated.filter(prop => [ 'pages', 'plugins', 'questions', 'name', 'userId' ].indexOf(prop) < 0)
      .forEach(prop => args[prop] = this.options[prop])
    this.updated.length = 0
    await update('PRE_forms', args, 'id', this.id)
    this.questions.forEach(q => q.updated = false)
    this.pages.forEach(p => p.updated = false)
  }

  /** Saves a form into the database. */
  async save () {
    if (this.saved) {
      await this.update()
      return
    }
    const stmt = 'INSERT INTO PRE_forms (user_id, name, lower_name, title, pages, questions, theme, plugins, data) VALUES ($1, $2::character varying(64), LOWER($2), $3, $4, $5, $6, $7, $8);'
    await query(stmt, this.params)
  }

  async destroy () {
    if (!this.saved) return
    await query('DELETE FROM PRE_forms WHERE id = $1;', [ this.id ])
    this.saved = false
  }

  get path () { return `${this.options.userName}/${this.options.name}` }

  /**
   * Get the HTML markup corresponding to the form.
   * @returns {string} HTML
   */
  async getHtml () {
    return (templateCache[this.options.theme]
      .replace(
        /\/vote-config.js/g,
        `/${this.path}/_bundle`
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
      userName: this.options.userName,
      name: this.options.name,
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
    await this.emit('getPage', [ this, path, ctx, r => res = r ])
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
      return await this.bundle(`/${this.path}/_submit`, 'POST')

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
    await this.emit('handleSubmission', [ this, ctx, r => res = r ])
    if (res) return res

    if (ctx.method !== 'POST') return 405 // Method Not Allowed
    if (!ctx.request.body) return 400

    let data = ctx.request.body
    if (Array.isArray(data)) {
      data = {}
      ctx.request.body.forEach((v, i) => data[i] = v)
    }

    let cancel = false
    await this.emit('validateSubmission', [ this, ctx, data, () => cancel = true ])
    if (cancel) return 400

    await query('INSERT INTO PRE_submissions (form_id, data) VALUES ($1, $2);', [ this.id, data ])
    return 200
  }

  /** Gets submissions of the form. */
  async getSubmissions () {
    const res = (await query('SELECT * FROM PRE_submissions WHERE form_id = $1;', [ this.id ])).rows
    for (let submission of res) {
      submission.formId = submission.form_id
      delete submission.form_id
    }
    await this.emit('getSubmissions', [ this, res ])
    return res
  }

  /** Gets submission IDs of the form. */
  async getSubmissionIds () {
    const res = (await query('SELECT id FROM PRE_submissions WHERE form_id = $1;', [ this.id ])).rows.map(r => r.id)
    await this.emit('getSubmissionIds', [ this, res ])
    return res
  }

  /**
   * Gets submission from given ID.
   * @param {string} id submission ID
   */
  async submissionFromId (id) {
    const res = (await query('SELECT * FROM PRE_submissions WHERE form_id = $1 AND id = $2;', [ this.id, id ])).rows[0]
    if (res) {
      res.formId = res.form_id
      delete res.form_id
    }
    return res || null
  }
}
