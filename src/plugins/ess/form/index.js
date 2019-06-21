import './styles.css'
import submitMixin from './submit'

window.addEventListener('vote:ready', () => {
  const hooks = window.voteHooks
  submitMixin(hooks)
})
