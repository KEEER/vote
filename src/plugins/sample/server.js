import { addValidationMixin, editorRouteMixin } from './common'
import logger from '@vote/core/log'
import { on, createServerInjection, addPage } from '@vote/api'

const log = logger.child({ part: 'plugin-sample' })
log.debug('plugin-sample loaded')

export default createServerInjection(() => {
  on('attached', () => log.debug('attached'))
  addPage('whatever', '<script>alert("whatever")</script>')
  editorRouteMixin()
  addValidationMixin()
})
