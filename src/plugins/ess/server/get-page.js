import { schema } from '../common/graphql'
import { graphql } from 'graphql'
import logger from '@vote/core/log'
import query from './query'
import { readDistFile } from '@vote/api'

const log = logger.child({ part: 'plugin-ess.get-page' })

const editorHtml = readDistFile('plugin-ess-editor.html')

export const handleGetPage = async ([ form, path, ctx, set ]) => {
  if ((
    !form.options.data
    || !form.options.data.settings
    || !form.options.data.settings['basic.retrieving']
  ) && (path === '' || path === 'fill' || path === '_bundle')
  ) return set(404)
  const user = ctx.state.user
  const unauthorized = () => ctx.state.userNoId ? ctx.requireLogin() : set(404)
  let authorized = user && user.id === form.options.userId || process.env.NODE_ENV === 'development'
  if (form.editorPaths.indexOf(path) > -1) {
    await form.emit('authorizeEditor', [ form, path, ctx, a => authorized = a ])
    // why not 403: return a 403 will indicate that the form exists.
    if (!authorized) return unauthorized()
    return set(editorHtml.replace(/\/vote-config.js/g, `/${form.path}/_bundle-editor`))
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
      if (!ctx.query.name || !/^([a-zA-Z0-9]|-|_)*$/i.test(ctx.query.name)) return set(400)
      if (ctx.query.name.length > 64) return set(400)
      form.options.name = ctx.query.name
      try { await form.update() } catch (e) {
        log.error(e)
        return set(500)
      }
      ctx.redirect(`/${form.path}/settings`)
      return set(200)
    } else { // delete
      await form.destroy()
      ctx.redirect('/')
      return set(200)
    }
  }
  if (path === '_bundle-editor') {
    let authorized = user && user.id === form.options.userId || process.env.NODE_ENV === 'development'
    await form.emit('authorizeEditor', [ form, path, ctx, a => authorized = a ])
    if (!authorized) return unauthorized()
    return set(await form.bundle(null, null, 'editor'))
  }
}
