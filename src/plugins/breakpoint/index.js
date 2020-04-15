import { createFormInjection, FormStorage } from '@vote/api'

createFormInjection(hooks => {
  const storage = new FormStorage('breakpoint', 'fill')
  hooks.on('form:mounted', form => {
    form.$watch('status', () => {
      if (form.status === 'submitted') storage.clear()
    })
    for (const page of form.pages) for (const q of page.questions) if (q.id in storage.data) q.value = storage.data[q.id]
    if ('_page' in storage.data) form.current = storage.data._page
  })
  hooks.on('question:update', ({ question }) => {
    const q = question.question || question.Question
    if (!q) return
    storage.data[q.id] = q.value
    storage.update()
  })
  hooks.on('form:update', form => {
    storage.data._page = form.current
    storage.update()
  })
})
