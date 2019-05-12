/** @module form */
import Question from './question'
import Plugin from './plugin'
import Theme from './theme'
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
}

/** Class representing a form. */
export class Form {
  /**
   * Creates a form object.
   * @param {object} options Options, see below.
   * @param {string} options.title The title of the form
   * @param {string|number} [options.id] Form ID
   * @param {Page[]} options.pages Pages in the form
   */
  constructor(options) {
    const {
      id,
      title,
      pages,
    } = options
    this.id = id
    this.title = title
    this.pages = pages

    this.data = options
  }

  /**
   * Gets the questions in the form.
   * @returns {module:question~Question[]} Questions.
   */
  get questions() {
    return this.pages.flatMap(p => p.questions)
  }

  // TODO: DB
  static async fromId() {}
  async save() {}
}
