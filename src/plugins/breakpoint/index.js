import { createFormInjection, FormStorage } from '@vote/api'

createFormInjection(hooks => {
  // create a storage to store breakpoint data
  const storage = new FormStorage('breakpoint', 'fill')
  // initialize on load, fill back any data
  hooks.on('form:mounted', form => {
    form.$watch('status', () => {
      if (form.status === 'submitted') storage.clear()
    })
    for (const page of form.pages) for (const q of page.questions) if (q.id in storage.data) q.value = storage.data[q.id]
    if ('_page' in storage.data) form.current = storage.data._page
  })
  // listen on updates:
  // 1. question value updates
  hooks.on('question:update', ({ question }) => {
    const q = question.question || question.Question
    if (!q) return
    storage.data[q.id] = q.value
    storage.update()
  })
  // 2. flip pages
  hooks.on('form:update', form => {
    storage.data._page = form.current
    storage.update()
  })
})
