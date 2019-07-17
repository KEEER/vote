import {readFileSync} from 'fs'
import path from 'path'

const editorHtml = readFileSync(
  path.resolve(__dirname, '../../../../dist/plugin-ess-editor.html')
).toString()

export default function attachTo(form) {
  form.on('getPage', async ([path, ctx, set]) => {
    if(path === 'edit' || path === 'settings') {
      // TODO: authenticate
      set(editorHtml)
    }
  })
}
