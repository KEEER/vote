import logger from '@vote/core/log'
import { editorRouteMixin } from './common'
import { addPage } from '@vote/api/server'

const log = logger.child({ part: 'plugin-sample' })

log.debug('plugin-sample loaded')

export default function attachTo (form) {
  log.debug('attached', form)
  editorRouteMixin(form)
  addPage('whatever', '<script>alert("whatever")</script>')(form)
}
