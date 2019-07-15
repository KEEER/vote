import {readFileSync} from 'fs'
import path from 'path'

const editorHtml = readFileSync(path.resolve(__dirname, '../../../../dist/plugin-ess-editor.html'))

export default function attachTo(form) {
  form.on('getPage', async ([path, ctx, set]) => {
    if(path === 'edit') {
      // TODO: authenticate
      set(editorHtml)
    }
    if(path === '_newQuestion' && ctx.method === 'POST') {
      // TODO: authenticate
      const body = ctx.request.body
      try {
        const question = new Question(body.data)
        form.pages[body.pageId].options.questions.push(question)
      } catch(e) {
        set(400)
        return
      }
      await form.update()
    }
  })
}
