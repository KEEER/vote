import { createFormInjection } from '@vote/api'

createFormInjection(hooks => {
  let questions
  let updateLayout = () => {}
  hooks.on('form:mounted', form => {
    questions = form.pages.flatMap(p => p.questions).map(q => q.abstractQuestion)
    form.$nextTick(() => {
      for (const q of questions) {
        q.setConfig('display', 'hidden', q.getConfig('branch', 'at-branch', false))
      }
      if ('updateLayout' in form && typeof form.updateLayout === 'function') updateLayout = () => form.$nextTick(() => form.updateLayout())
      updateLayout()
    })
  })
  hooks.on('question:update', ({ question, value }) => {
    if (question.type !== 'VRadio') return
    const branches = question.getConfig('branch', 'branches')
    if (!branches) return
    const branch = branches[value]
    if (!branch) return
    for (const q of questions) {
      const at = q.getConfig('branch', 'at-branch', false)
      q.setConfig('display', 'hidden', at && at !== branch)
    }
    updateLayout()
  })
  hooks.on('question:validatorOverride', ({ question, set }) => {
    if (question.getConfig('display', 'hidden', false)) set(true)
  })
})
