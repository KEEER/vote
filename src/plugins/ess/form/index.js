import submitMixin from './submit'
import { validateMixin } from './validate'

window.addEventListener('vote:ready', () => {
  const hooks = window.voteHooks
  submitMixin(hooks)
  validateMixin(hooks)
})
