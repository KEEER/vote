import logger from '../../log'

const log = logger.child({ part: 'plugin-sample' })

log.debug('plugin-sample loaded')

export default function attachTo (form) {
  log.debug('attached', form)
  form.editorPaths = [ 'sample', ...(form.editorPaths || []) ]
  form.on('getPage', async ([ path, , set ]) => {
    log.debug('getPage', path, set)
    if (path === 'whatever') {
      set('<script>alert("whatever")</script>')
    }
  })
}
