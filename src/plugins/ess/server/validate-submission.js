import { validator } from '../common/validator'

export const handleValidateSubmission = async ({ form, ctx, data, invalidate }) => {
  for (const question of form.questions) {
    let bypass = false
    /**
     * Server-side question validation override event.
     * @event Form#validateQuestionOverride
     * @property {module:question~Question} question the question to validate
     * @property {module:form~Form} form the form to validate
     * @property {Koa.Context} ctx Koa context
     * @property {any} data all the data, get question answer by `data[question.id]`
     * @property {function} invalidate call to mark as invalid
     * @property {function} finalize call to override default validator
     */
    await form.emit('validateQuestionOverride', {
      question,
      form,
      ctx,
      data,
      invalidate: () => (bypass = true, invalidate()),
      finalize: () => bypass = true,
    })
    if (bypass) continue
    if (validator(question, data[question.id]) !== null) return invalidate()
  }
}
