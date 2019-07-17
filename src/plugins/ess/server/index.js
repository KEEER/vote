import {readFileSync} from 'fs'
import path from 'path'
import {schema} from '../graphql'
import {graphql} from 'graphql'

const editorHtml = readFileSync(
  path.resolve(__dirname, '../../../../dist/plugin-ess-editor.html')
).toString()

export default function attachTo(form) {
  form.on('getPage', async ([path, ctx, set]) => {
    if(path === 'edit' || path === 'settings') {
      // TODO: authenticate
      set(editorHtml)
      return
    }
    if(path === '_query' && ctx.method === 'POST') {
      // TODO: authenticate
      set(JSON.stringify(
        await graphql(schema, ctx.request.body, {
          async hello() {
            return {
              thing: 'World',
            }
          },
        })
      ))
    }
  })
}
