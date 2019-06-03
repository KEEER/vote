/** @module question */
let lastid = 0
const getid = () => lastid++

/** Class representing a question. */
class Question {
  /**
   * Creates a question object.
   * @param {Object} options Options, see below.
   * @param {string} options.type The type of the question
   * @param {string} options.title Question title
   * @param {string|number} [options.id=itoa] Question ID
   * @param {*} [options.value] Default value of the question
   */
  constructor(options) {
    this.is = 'Question'
    const {
      id,
      type = 'VText',
      title,
      value,
    } = options
    this.data = options
    this.id = id || getid()
    this.type = type
    this.title = title
    this.value = value
  }

  /**
   * Get a object to be stored.
   * @returns {object} Object representing the question
   */
  toObject() {
    return Object.assign({}, this.options, {
      type: this.type,
      id: this.id,
      value: this.value,
      title: this.title,
    })
  }
}

export default Question
