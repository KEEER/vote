import { handleUpdateBasicSettings, handlePreprocessBasicSettings } from './basic-settings'
import { handleGetPage } from './get-page'
import { handleValidateSubmission } from './validate-submission'
import { handleGetStats } from './stats'
import { plugins } from '@vote/core/plugin'
import { themes } from '@vote/core/theme'

export default function attachTo (form) {
  form.editorPaths = [ 'edit', 'settings', 'data', 'stats', 'fn', ...(form.editorPaths || []) ]
  form.on('getPage', handleGetPage)
  form.on('bundle', ({ form, data, key }) => {
    if (key === 'editor') {
      delete data.action
      delete data.method
      delete data.data
      data.plugins = form.options.plugins.map(p => p.config.code)
      data.allPlugins = plugins.map(p => p.config)
      data.allThemes = themes.map(t => t.config)
    }
  })
  form.on('validateSubmission', handleValidateSubmission)
  form.on('updateSettings', handleUpdateBasicSettings)
  form.on('preprocessData', handlePreprocessBasicSettings)
  form.on('getStat', handleGetStats)
}
