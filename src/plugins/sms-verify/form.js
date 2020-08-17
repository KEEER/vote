import SmsVerifyForm, { numberValidator } from './SmsVerifyForm.vue'
import { createFormInjection, addQuestionType } from '@vote/api'
createFormInjection(hooks => {
  hooks.on('plugin-ess:validatorLoaded', v => numberValidator.v = v.textValidators.mobile)
  addQuestionType('VSmsVerify', SmsVerifyForm)
})
