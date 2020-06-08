import { graphql } from 'graphql'
import { schema } from '../common/graphql'
import query from './query'
import { exportForm } from './export'
import logger from '@vote/core/log'
import { readDistFile } from '@vote/api'
import { isDev } from '@vote/core/is-dev'

const log = logger.child({ part: 'plugin-ess.get-page' })

const editorHtml = readDistFile('plugin-ess-editor.html')

export const handleGetPage = async ({ form, path, ctx, set }) => {
  if ((
    !form.options.data
    || !form.options.data.settings
    || !form.options.data.settings['basic.retrieving']
  ) && (path === '' || path === 'fill' || path === '_bundle')
  ) return set(404)
  const user = ctx.state.user
  const authorize = async what => {
    await form.emit(`authorize${what[0].toUpperCase()}${what.substr(1)}`, { form, path, ctx, set: a => authorized = a })
    // why not 403: return a 403 will indicate that the form exists.
    if (!authorized) ctx.state.userNoId ? ctx.requireLogin() : set(404)
    return authorized
  }
  /**
   * @typedef {object} AuthorizeEventParam
   * @property {module:form~Form} form the form itself
   * @property {string} path editor path
   * @property {Koa.Context} ctx Koa context
   * @property {function} set setter function
   */
  /**
   * Authorize editor event.
   * @event Form#authorizeEditor
   * @type {AuthorizeEventParam}
   */
  /**
   * Authorize editor query event.
   * @event Form#authorizeQuery
   * @type {AuthorizeEventParam}
   */
  /**
   * Authorize editor export event.
   * @event Form#authorizeExport
   * @type {AuthorizeEventParam}
   */
  /**
   * Authorize editor rename / delete event.
   * @event Form#authorizeRenameOrRemoval
   * @type {AuthorizeEventParam}
   */
  let authorized = user && String(user.id) === String(form.options.userId) || isDev
  if (form.editorPaths.includes(path)) {
    if (!await authorize('editor')) return
    return set(editorHtml.replace(/\/?vote-config.js/g, `/${form.path}/_bundle-editor`))
  }
  if (path === '_query' && ctx.method === 'POST') {
    if (!await authorize('query')) return
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
    if (!await authorize('renameOrRemoval')) return
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
    if (!await authorize('editor')) return
    return set(await form.bundle('', '', 'editor'))
  }
  if (path === '_export') {
    if (!await authorize('export')) return
    return set(await exportForm(form, ctx))
  }
}
