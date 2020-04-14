import { createFormInjection } from '@vote/api'

// noinspection SpellCheckingInspection
const magic = 'KVOTEBP'
const debounce = (func, wait) => {
  let lastCallTime = -1
  let timeoutId = -1
  return (...args) => {
    const time = Date.now()
    const callFunc = () => func(...args)
    if (lastCallTime < time - wait) {
      lastCallTime = time
      if (timeoutId > -1) {
        clearTimeout(timeoutId)
        window.removeEventListener('beforeunload', callFunc)
      }
      timeoutId = -1
      callFunc()
      return
    }
    if (timeoutId > -1) return
    setTimeout(func, timeoutId, ...args)
    window.addEventListener('beforeunload', callFunc)
  }
}

createFormInjection(hooks => {
  let { pathname } = location
  const fill = '/fill'
  const slash = '/'
  if (pathname.endsWith(fill)) pathname = pathname.slice(0, -fill.length)
  if (pathname.endsWith(slash)) pathname = pathname.slice(0, -slash.length)
  const storageKey = magic + pathname
  let storage = {}
  const updateStorage = () => localStorage[storageKey] = JSON.stringify(storage)

  hooks.on('form:mounted', form => {
    form.$watch('status', () => {
      if (form.status === 'submitted') {
        storage = {}
        delete localStorage[storageKey]
      }
    })
    if (!(storageKey in localStorage)) return
    try {
      storage = JSON.parse(localStorage[storageKey])
      for (const page of form.pages) for (const q of page.questions) {
        if (q.id in storage) q.value = storage[q.id]
      }
      if ('_page' in storage) form.current = storage._page
    } catch (e) {
      console.error('Error on breakpoint: ', e)
    }
  })
  hooks.on('question:update', debounce(({ question }) => {
    const q = question.question || question.Question
    if (!q) return
    storage[q.id] = q.value
    updateStorage()
  }, 500))
  hooks.on('form:update', form => {
    storage._page = form.current
    updateStorage()
  })
})
