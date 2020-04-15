import { addCombinedQuestionType, createFormInjection, FormStorage } from '@vote/api'

const QUESTION_TYPE = 'VAutofill'
createFormInjection(hooks => {
  const storage = new FormStorage('autofill', 'user')
  // TODO: allow types other than VText
  addCombinedQuestionType(QUESTION_TYPE, () => [ { type: 'VText', show: true } ])
  hooks.on('form:mounted', form => form.$nextTick(() => {
    for (const page of form.pages) for (const q of page.questions) if (q.type === QUESTION_TYPE) {
      try {
        const value = storage.data[q.data.options[0].type]
        if (value && (!q.value || q.value[0] === undefined)) q.value = [ value ]
      } catch (e) {} // eslint-disable-line no-empty
    }
  }))
  hooks.on('question:update', ({ question }) => {
    const q = question.question || question.Question
    if (!q || q.type !== QUESTION_TYPE) return
    try { storage.data[q.data.options[0].type] = q.value[0] } catch (e) {} // eslint-disable-line no-empty
    storage.update()
  })
})
