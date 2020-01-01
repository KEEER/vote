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
  form.on('getPage', async ([ path, ctx, set ]) => {
    if (path === 'edit' || path === 'settings') {
      // TODO: authenticate
      set(editorHtml)
      return
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
      set(JSON.stringify(data))
    }
  })
  form.on('updateSettings', handleUpdateBasicSettings)
  form.on('preprocessData', handlePreprocessBasicSettings)
}
