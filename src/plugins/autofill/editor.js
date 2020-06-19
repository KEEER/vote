import AutofillEditor from './AutofillEditor'
import { types, walkStrings } from './types'
import { addCombinedQuestionType, createEditorInjection } from '@vote/api'

const QUESTION_TYPE = 'VAutofill', EDITOR_COMPONENT = 'VoteAutofillEditor'
createEditorInjection(() => {
  Vue.component(EDITOR_COMPONENT, AutofillEditor)
  addCombinedQuestionType(QUESTION_TYPE, vm => {
    if (vm.isEditor) return [ { show: true, type: EDITOR_COMPONENT } ]
    const typeConfig = types[vm.options[0].type]
    if ('options' in typeConfig) vm.options_ = [ typeConfig.options ]
    return [ { show: true, ...walkStrings(typeConfig, vm.$t.bind(vm)) } ]
  })
})
