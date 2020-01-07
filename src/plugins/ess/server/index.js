import { readFileSync } from 'fs'
import path from 'path'
import { schema } from '../common/graphql'
import { graphql } from 'graphql'
import query from './query'
import { handleUpdateBasicSettings, handlePreprocessBasicSettings } from './basic-settings'

const editorHtml = readFileSync(
  path.resolve(__dirname, '../../../../dist/plugin-ess-editor.html')
).toString()

export default function attachTo (form) {
  form.editorPaths = [ 'edit', 'settings', 'data', ...(form.editorPaths || []) ]
  form.on('getPage', async ([ path, ctx, set ]) => {
    if (form.editorPaths.indexOf(path) > -1) {
      // TODO: authenticate
      return set(editorHtml.replace(/\/vote-config.js/g, `/${form.id}/_bundle-editor`))
    }
    if (path === '_query' && ctx.method === 'POST') {
      // TODO: authenticate
      let data
      try {
        data = await graphql(
          schema,
          ctx.request.body.query,
          query,
          ctx,
          ctx.request.body.variables,
        )
      } catch (e) {
        data = { errors: [ e ] }
      }
      return set(JSON.stringify(data))
    }
    if (path === '_bundle-editor') {
      return set(await form.bundle(null, null, 'editor'))
    }
  })
  form.on('bundle', ([ , data,,, key ]) => {
    if (key === 'editor') {
      delete data.action
      delete data.method
      delete data.data
    }
  })
  form.on('updateSettings', handleUpdateBasicSettings)
  form.on('preprocessData', handlePreprocessBasicSettings)
}
