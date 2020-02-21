import { readFileSync } from 'fs'
import path from 'path'
import { schema } from '../common/graphql'
import { graphql } from 'graphql'
import logger from '../../../log'
import query from './query'
import { handleUpdateBasicSettings, handlePreprocessBasicSettings } from './basic-settings'

const log = logger.child({ part: 'plugin-ess.main' })

const editorHtml = readFileSync(
  path.resolve(__dirname, '../../../../dist/plugin-ess-editor.html')
).toString()

export default function attachTo (form) {
  form.editorPaths = [ 'edit', 'settings', 'data', ...(form.editorPaths || []) ]
  form.on('getPage', async ([ path, ctx, set ]) => {
    if (
      !form.options.data
      || !form.options.data.settings
      || !form.options.data.settings['basic.retrieving']
      && (path === '' || path === 'fill' || path === '_bundle')
    ) return set(404)
    const user = ctx.state.user
    const unauthorized = () => ctx.state.userNoId ? ctx.requireLogin() : set(404)
    let authorized = user && user.id === form.options.userid || process.env.NODE_ENV === 'development'
    if (form.editorPaths.indexOf(path) > -1) {
      await form.emit('authorizeEditor', [ form, path, ctx, a => authorized = a ])
      // why not 403: return a 403 will indicate that the form exists.
      if (!authorized) return unauthorized()
      return set(editorHtml.replace(/\/vote-config.js/g, `/${form.id}/_bundle-editor`))
    }
    if (path === '_query' && ctx.method === 'POST') {
      await form.emit('authorizeQuery', [ form, path, ctx, a => authorized = a ])
      if (!authorized) return unauthorized()
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
    if (path === '_rename' || path === '_delete') {
      await form.emit('authorizeRenameOrRemoval', [ form, path, ctx, a => authorized = a ])
      if (!authorized) return unauthorized()
      if (path === '_rename') {
        if (!ctx.query.id || !/^([a-zA-Z0-9]|-|_)*$/i.test(ctx.query.id)) return set(400)
        form.id = `${user.id}/${ctx.query.id}`
        if (form.id.length > 64) return set(400)
        try { await form.update() } catch (e) {
          log.error(e)
          return set(500)
        }
        ctx.redirect(`/${form.id}/settings`)
        return set(200)
      } else { // delete
        await form.destroy()
        ctx.redirect('/')
        return set(200)
      }
    }
    if (path === '_bundle-editor') {
      let authorized = user && user.id === form.options.userid || process.env.NODE_ENV === 'development'
      await form.emit('authorizeEditor', [ form, path, ctx, a => authorized = a ])
      if (!authorized) return unauthorized()
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
