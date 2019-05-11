/** @module form */
import Question from './question'
import Plugin from './plugin'
import Theme from './theme'
// TODO
/**
 * Class representing a page.
 */
class Page {
  /**
   * Creates a page object.
   * @param {Object} options Options, see below.
   * @param {string} options.title The title of the page
   * @param {string|number} options.id Page ID
   * @param {module:question~Question} options.questions[] questions in the page.
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
   * TODO
   */
  toObject() {
    return {
      title: this.title,
      id: this.id,
      questions: this.questions.map(q => q.id)
    }
  }
}
