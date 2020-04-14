/** @module question */

import assert from 'assert'

/** Class representing a question. */
class Question {
  /**
   * Creates a question object.
   * @param {Object} options Options, see below.
   * @param {string} options.type The type of the question
   * @param {string} options.title Question title
   * @param {number} options.id Question ID
   * @param {*} [options.value] Default value of the question
   */
  constructor (options) {
    this.is = 'question'
    assert(typeof options === 'object')
    assert(typeof options.type === 'string')
    assert(typeof options.title === 'string')
    assert(typeof options.id === 'number')
    this.options = new Proxy(options, {
      set: (obj, prop, value) => {
        obj[prop] = value
        this.updated = true
        return true
      },
    })
  }

  get id () {
    return this.options.id
  }
  set id (id) {
    this.options.id = id
  }

  /**
   * Get a object to be stored.
   * @returns {object} Object representing the question
   */
  toObject () {
    return Object.assign({}, this.options, {
      type: this.options.type,
      id: this.options.id,
      value: this.options.value,
      title: this.options.title,
    })
  }
}

export default Question
