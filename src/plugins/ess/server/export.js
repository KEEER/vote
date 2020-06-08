import { Transform } from 'stream'
import stringify from 'csv-stringify'
import { getConfig } from '@vote/api/index'

const bom = Buffer.from('EFBBBF', 'hex')
class AddBomTransform extends Transform {
  constructor (stream, options) {
    super(options)
    stream.pipe(this)
    // FXXX MICRO$OFT, see: https://stackoverflow.com/questions/15685053/save-csv-with-bom
    this.push(bom)
  }
  _transform (chunk, _encoding, callback) { callback(null, chunk) }
}

// disabling require-await for possible forward-compatibility
// eslint-disable-next-line require-await
export async function exportForm (form, ctx) {
  const stringifier = stringify()
  // noinspection ES6MissingAwait
  writeData(form, stringifier, ctx)
  ctx.set('Content-Type', 'text/csv')
  ctx.set('Content-Disposition', `attachment; filename="${form.options.name}.csv"`)
  return new AddBomTransform(stringifier)
}

export function handleExportQuestionData ({ question, answer, set }) {
  if (!answer) return
  switch (question.options.type) {
  case 'VCheckbox':
    return set(Object.keys(answer).filter(k => answer[k]).map(k => question.options.options.find(x => x.value === k).label).join(', '))
  case 'VRadio':
    return set(question.options.options.find(x => x.value === answer).label)
  }
}

const writeData = async (form, stringifier, ctx) => {
  const { questions } = form
  const header = await Promise.all(questions.map(async question => {
    let data = question.options.title
    /**
     * Export question header event.
     * @event Form#exportQuestionHeader
     * @type {object}
     * @property {module:form~Form} form the form itself
     * @property {module:question~Question} question the question to export
     * @property {function(string|string[])} set setter function
     */
    await form.emit('exportQuestionHeader', { form, question, set: d => data = d })
    return data
  }))
  const hasTags = getConfig(form, 'settings', 'tags.enabled', false)
  header.unshift(ctx.$t('plugin.ess.export.id'), ctx.$t('plugin.ess.export.time'), ...(hasTags ? [ ctx.$t('plugin.ess.export.tags') ] : []))
  /**
   * Postprocess question export header event.
   * @event Form#postprocessExportQuestionHeader
   * @type {object}
   * @property {module:form~Form} form the form itself
   * @property {module:question~Question[]} questions the questions of the form
   * @property {string[]} header the header exported
   */
  await form.emit('postprocessExportQuestionHeader', { form, questions, header })
  stringifier.write(header.flat(1))
  const ids = await form.getSubmissionIds()
  for (const i of ids) {
    const [ submission, tags ] = await Promise.all([ form.getSubmission(i), form.getSubmissionTags(i, true) ])
    const data = await Promise.all(questions.map(async question => {
      const answer = submission.data[question.id]
      let data = answer ? String(answer) : ''
      /**
       * Export question data event.
       * @event Form#exportQuestionData
       * @type {object}
       * @property {module:form~Form} form the form itself
       * @property {module:question~Question} question the question to export
       * @property {object} submission the submission object
       * @property {string[]} tags the tags of the submission
       * @property {string} submissionId submission ID
       * @property {any} answer the answer to the question
       * @property {function(string|string[])} set setter function
       */
      await form.emit('exportQuestionData', {
        form,
        question,
        submission,
        tags,
        submissionId: i,
        answer,
        set: d => data = d,
      })
      return data
    }))
    data.unshift(i, String(submission.time), ...(hasTags ? [ tags.join(', ') ] : []))
    /**
     * Postprocess question data event.
     * @event Form#postprocessExportQuestionData
     * @type {object}
     * @property {module:form~Form} form the form itself
     * @property {module:question~Question[]} questions the questions of the form
     * @property {string[]} data the data exported
     */
    await form.emit('postprocessExportQuestionData', { form, questions, data })
    stringifier.write(data.flat(1))
  }
  stringifier.end()
}
