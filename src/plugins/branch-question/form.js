import { createFormInjection } from '@vote/api'

createFormInjection(hooks => {
  let form
  hooks.on('form:mouted', _form => form = _form)
  hooks.on('question:update', ({ thisq, value }) => {
    if (thisq.type !== 'VRadio' && thisq.type !== 'VCheckBox') return
    let selected
    for (option of thisq.options) {
      if (option.label === value) {
        selected = option
        break
      }
    }
    const branch = question.getConfig('branch', 'branches')
    for (q of form.questions) {
      if (q.getConfig('branch', 'branch') === branch) {
        question.setConfig('display', 'hidden', true)
      }
    }
  })
})
