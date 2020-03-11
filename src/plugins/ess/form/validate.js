import { validator } from '../common/validator'

export function validateMixin (hooks) {
  hooks.on('question:update', ([ q ]) => {
    const question = q.Question
    if (!question.valid) {
      if (question.validity.reason === 'required') return question.invalidTip = q.$t('core.question.validation.invalidTip.required')
      if (!question.data.config.validation.showValidation) {
        return question.invalidTip = q.$t('core.question.validation.invalidTip.hidden')
      }
      if (question.data.config.validation.invalidTip) {
        return question.invalidTip = question.data.config.validation.invalidTip
      }
      let msgKey, data
      switch (question.validity.reason) {
      case 'text-unsatisfied':
        msgKey = question.data.config.validation.type.join('.')
        data = { rule: question.data.config.validation[`${question.data.config.validation.type[0]}Content`] }
        break
      case 'checkbox-under-min':
        msgKey = 'minSelection'
        data = { rule: question.data.config.validation.minSelection }
        break
      case 'checkbox-over-max':
        msgKey = 'maxSelection'
        data = { rule: question.data.config.validation.maxSelection }
        break
      }
      if (msgKey) return question.invalidTip = q.$t(`core.question.validation.invalidTip.${msgKey}`, data)
    } else question.invalidTip = ''
  })
  hooks.on('question:validate', ([ q, invalidate ]) => {
    let res
    hooks.emit('question:validatorOverride', [ q, r => res = r ])
    if (typeof res !== 'undefined') {
      if (res === false || typeof res === 'string') invalidate(res)
      return
    }
    res = validator(q.data, q.value)
    if (res !== null) return invalidate(res)
  })
}
