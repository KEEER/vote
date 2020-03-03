import { handleUpdateBasicSettings, handlePreprocessBasicSettings } from './basic-settings'
import { handleGetPage } from './get-page'
import { handleValidateSubmission } from './validate-submission'

export default function attachTo (form) {
  form.editorPaths = [ 'edit', 'settings', 'data', ...(form.editorPaths || []) ]
  form.on('getPage', handleGetPage)
  form.on('bundle', ([ , data,,, key ]) => {
    if (key === 'editor') {
      delete data.action
      delete data.method
      delete data.data
    }
  })
  form.on('validateSubmission', handleValidateSubmission)
  form.on('updateSettings', handleUpdateBasicSettings)
  form.on('preprocessData', handlePreprocessBasicSettings)
}
