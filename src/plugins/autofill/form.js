import { types, walkStrings } from './types'
import { addCombinedQuestionType, createFormInjection, FormStorage } from '@vote/api'

const QUESTION_TYPE = 'VAutofill'
createFormInjection(hooks => {
  const storage = new FormStorage('autofill', 'user')
  addCombinedQuestionType(QUESTION_TYPE, vm => [ { show: true, required: vm.abstractQuestion.required, ...walkStrings(types[vm.data.options[0].type], vm.$t.bind(vm)) } ])
  hooks.on('form:mounted', form => form.$nextTick(() => {
    for (const page of form.pages) for (const q of page.questions) if (q.type === QUESTION_TYPE) {
      try {
        const value = storage.data[q.data.options[0].type]
        if (value && (!q.value || q.value[0] === undefined)) q.value = [ value ]
      } catch (e) { /* empty */ }
    }
  }))
  hooks.on('question:update', ({ question }) => {
    if (!question || question.type !== QUESTION_TYPE) return
    try { storage.data[q.options[0].type] = q.value[0] } catch (e) { /* empty */ }
    storage.update()
  })
})
