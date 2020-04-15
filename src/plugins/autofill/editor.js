import { addCombinedQuestionType, createEditorInjection } from '@vote/api'
import AutofillEditor from './AutofillEditor'

const QUESTION_TYPE = 'VAutofill', EDITOR_COMPONENT = 'VoteAutofillEditor'
createEditorInjection(() => {
  Vue.component(EDITOR_COMPONENT, AutofillEditor)
  addCombinedQuestionType(QUESTION_TYPE, vm => [ { type: vm.isEditor ? EDITOR_COMPONENT : 'VText', show: true } ])
})
