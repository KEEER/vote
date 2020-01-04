import assert from 'assert'
import { plugins as allPlugins } from '../../../plugin'

export async function handleUpdateBasicSettings ([ form, name, value, set ]) {
  if (name.startsWith('basic.')) {
    switch (name.substr(6)) {
    case 'title':
      if (typeof value !== 'string' || value.length === 0) return set(false)
      form.options.title = value
      await form.update()
      return set(true)

    case 'plugins':
      try {
        assert(typeof value === 'string')
        const pluginCodes = JSON.parse(value)
        assert(Array.isArray(pluginCodes))
        const plugins = pluginCodes.map(code => allPlugins.find(p => p.config.code === code))
        assert(plugins.every(p => !!p))
        // TODO: check pro features
        form.options.plugins = plugins
        await form.update()
      } catch (e) {
        return set(false)
      }
      return set(true)

    default:
      return set(false)
    }
  }
}

export function handlePreprocessBasicSettings ([ form, data ]) {
  if (!data.settings) data.settings = {}
  data.settings['basic.title'] = form.options.title
  data.settings['basic.plugins'] = JSON.stringify(form.options.plugins.map(p => p.config.code))
  data.settings['basic._all-plugins'] = JSON.stringify(allPlugins.map(p => p.config))
}
