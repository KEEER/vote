export default hooks => {
  hooks.on('form:submit', form => {
    if (form.method !== 'POST') throw new Error('Only POST is supported by now')
    const payload = JSON.stringify(form.formdata)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', form.action)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      if (xhr.status !== 200) {
        form.status = 'submiterror'
        /**
         * Form submit error event.
         * @type {object}
         * @property {form:Form} form Vue instance of the form
         * @property {XMLHttpRequest} xhr the XMLHttpRequest
         */
        hooks.emit('form:submiterror', { form, xhr })
      } else {
        form.status = 'submitted'
        /**
         * Form submitted event.
         * @type {form:Form}
         */
        hooks.emit('form:submitted', form)
      }
    }
    try {
      xhr.send(payload)
      form.status = 'submitting'
    } catch (e) {
      console.error(e)
      hooks.emit('form:error', e)
    }
  })
  hooks.on('form:beforeSubmit', ({ form, cancel }) => form.valid ? null : cancel())
}
