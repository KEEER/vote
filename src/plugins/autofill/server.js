import { types } from './types'
import { createServerInjection, addCombinedQuestionType } from '@vote/api'

export default createServerInjection(() => {
  addCombinedQuestionType('VAutofill', ({ question }) => [ types[question.options[0].type] ])
})
