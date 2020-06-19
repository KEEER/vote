import { validator } from '../common/validator'

export function validateMixin (hooks) {
  hooks.on('question:update', ({ question }) => {
    const $t = (...args) => question.vueInstance.$t(...args)
    if (!question.valid) {
      if (question.validity.reason === 'required') return question.invalidTip = $t('core.question.validation.invalidTip.required')
      if (!question.getConfig('validation', 'showValidation', true)) {
        return question.invalidTip = $t('core.question.validation.invalidTip.hidden')
      }
      if (question.getConfig('validation', 'invalidTip')) {
        return question.invalidTip = question.config.validation.invalidTip
      }
      let msgKey, data
      switch (question.validity.reason) {
      case 'text-unsatisfied':
        msgKey = question.config.validation.type.join('.')
        data = { rule: question.getConfig('validation', `${question.getConfig('validation', 'type', [ 'text' ])[0]}Content`) }
        break
      case 'checkbox-under-min':
        msgKey = 'minSelection'
        data = { rule: question.getConfig('validation', 'minSelection') }
        break
      case 'checkbox-over-max':
        msgKey = 'maxSelection'
        data = { rule: question.getConfig('validation', 'maxSelection') }
        break
      }
      if (msgKey) return question.invalidTip = $t(`core.question.validation.invalidTip.${msgKey}`, data)
    } else question.invalidTip = ''
  })
  hooks.on('question:validate', ({ question, invalidate }) => {
    let res
    /**
     * Question validator override event.
     * @event form.question:validatorOverride
     * @type {object}
     * @property {AbstractQuestion} question the question
     * @property {function} set set result callback
     */
    hooks.emit('question:validatorOverride', { question, set: r => res = r })
    if (typeof res !== 'undefined') {
      if (res === false || typeof res === 'string') invalidate(res)
      return
    }
    res = validator(question, question.value)
    if (res !== null) return invalidate(res)
  })
}
