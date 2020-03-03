import { validator } from '../common/validator'

export const handleValidateSubmission = async ([ form, ctx, data, cancel ]) => {
  for (let question of form.questions) {
    let c = false
    await form.emit('validateQuestionOverride', [ form, ctx, data, cancel, () => c = true ])
    if (c) return
    if (validator(question.options, data[question.id]) !== null) cancel()
  }
}
