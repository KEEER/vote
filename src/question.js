/** @module question */

import assert from 'assert'
import { AbstractQuestion, optionsSymbol } from '@vote/api'

/** Class representing a question. */
class Question extends AbstractQuestion {
  /**
   * Creates a question object.
   * @param {Object} options Options, see below.
   * @param {string} options.type The type of the question
   * @param {string} options.title Question title
   * @param {number} options.id Question ID
   * @param {*} [options.value] Default value of the question
   */
  constructor (options) {
    assert(typeof options === 'object')
    assert(typeof options.type === 'string')
    assert(typeof options.title === 'string')
    assert(typeof options.id === 'number')
    super(new Proxy(options, {
      set: (obj, prop, value) => {
        obj[prop] = value
        this.updated = true
        return true
      },
    }))
  }

  /**
   * Get a object to be stored.
   * @returns {object} Object representing the question
   */
  toObject () {
    const options = this[optionsSymbol]
    return Object.assign({}, options, {
      type: options.type,
      id: options.id,
      value: options.value,
      title: options.title,
    })
  }
}

export default Question
