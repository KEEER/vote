import { validator } from '../common/validator'

export const handleValidateSubmission = async ([ form, ctx, data, cancel ]) => {
  for (let question of form.questions) {
    let c = false
    await form.emit('validateQuestionOverride', [ question, form, ctx, data, () => (c = true, cancel()), () => c = true ])
    if (c) return
    if (validator(question.options, data[question.id]) !== null) cancel()
  }
}
