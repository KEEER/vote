export default hooks => {
  hooks.on('form:submit', ([form]) => {
    if (form.method !== 'POST') throw new Error('Only POST is supported by now')
    const payload = JSON.stringify(form.formdata)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', form.action)
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      if (xhr.status !== 200) {
        form.status = 'submiterror'
        hooks.emit('form:submiterror', [form, xhr])
      } else {
        form.status = 'submitted'
        hooks.emit('form:submitted', [form])
      }
    }
    try {
      xhr.send(payload)
      form.status = 'submitting'
    } catch (e) {
      console.error(e)
      hooks.emit('form:error', [e])
    }
  })
}
