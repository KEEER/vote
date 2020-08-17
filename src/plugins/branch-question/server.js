import logger from '@vote/core/log'
import { on, createServerInjection, addPage } from '@vote/api'

const log = logger.child({ part: 'plugin-branch-question' })
log.debug('plugin-branch-question loaded')

export default createServerInjection(() => {
  on('attached', () => log.debug('attached'))
  addPage('whatever', '<script>alert("whatever")</script>')
})
