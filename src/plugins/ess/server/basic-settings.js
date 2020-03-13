export async function handleUpdateBasicSettings ({ form, name, value, set }) {
  if (name.startsWith('basic.')) {
    switch (name.substr(6)) {
    case 'title':
      if (typeof value !== 'string' || value.length === 0) return set(false)
      form.options.title = value
      await form.update()
      return set(true)

    default:
      return
    }
  }
}

export function handlePreprocessBasicSettings ({ form, data }) {
  if (!data.settings) data.settings = {}
  data.settings['basic.title'] = form.options.title
}
