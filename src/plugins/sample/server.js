import log from '../../log'

log.debug('plugin-sample loaded')

export default function attachTo(form) {
  log.debug('attached', form)
  form.on('getPage', async ([path, , set]) => {
    log.debug('getPage', path, set)
    if(path === 'whatever') {
      set('<script>alert("whatever")</script>')
    }
  })
}
