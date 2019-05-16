/** @module form */
import Question from './question'
import Plugin from './plugin'
import Theme from './theme'
import {useClient, query} from './db'
import * as log from './log'

// TODO
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
      questions: this.questions.map(q => q.id)
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
export class Form {
  /**
   * Creates a form object.
   * @param {object} options Options, see below.
   * @param {string} options.title The title of the form
   * @param {string|number} options.id Form ID
   * @param {Page[]} options.pages Pages in the form
   */
  constructor(options) {
    this.options = options
  }

  get id() {
    return this.options.id
  }
  set id(id) {
    this.options.id = id
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
    const data = res.rows[0]
    data.questions = data.questions.map(q => new Question(q))
    data.pages = Page.fromObject(data.pages, data.questions)
    return new Form(data)
  }

  /**
   * Saves a form into database.
   */
  async save() {
    const params = [
      this.id,
      this.options.title,
      this.pages.map(p => p.toObject()),
      this.questions.map(q => q.toObject()),
      this.options.theme,
      this.options.plugins,
      this.options.data,
    ]
    // TODO: check if not saved
    const stmt = 'UPDATE PRE_forms SET title = $2, pages = $3, questions = $4, theme = $5, plugins = $6, data = $7 WHERE id = $1;'
    await query(stmt, params)
  }
}
