/** @module main */
import 'array-flat-polyfill'
import path from 'path'
import logger from './log'
import { Form, Page } from './form'
import Koa from 'koa'
import Router from 'koa-router'
import BodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { User } from './user'
import generateName from 'project-name-generator'
import { query } from './db'
import { plugins } from './plugin'
import { themes } from './theme'

const log = logger.child({ part: 'main' })

const app = new Koa()
const router = new Router()

router.get('/js/*', serveStatic(path.resolve(__dirname, '../dist')))
router.get('/css/*', serveStatic(path.resolve(__dirname, '../dist')))

router.all('/:uid/:id/:pid?', async ctx => {
  const id = ctx.params.uid + '/' + ctx.params.id
  const form = await Form.fromId(id)
  if (form === null) {
    // TODO: handle these cases
    ctx.status = 404
    return
  }
  ctx.state.form = form
  ctx.status = 200
  const resp = await form.getPage(ctx.params.pid || '', ctx)
  if (resp === null) {
    ctx.status = 404
    return
  }
  if (typeof resp === 'number') {
    ctx.status = resp
    return
  }
  if (typeof resp === 'string') {
    ctx.body = resp
    return
  }
  throw new TypeError(`typeof resp is ${typeof resp}, expected null|number|string`)
})

router.get('/_forms', async ctx => {
  ctx.requireLogin()
  const forms = await Form.fromUserId(ctx.state.user.id)
  if (!forms) return ctx.body = []
  const formDatas = await Promise.all(forms.map(async f => ({
    id: f.id,
    title: f.options.title,
    data: f.options.data,
    submissionCount: (await f.getSubmissionIds()).length,
  })))
  return ctx.body = formDatas
})

if (process.env.NODE_ENV === 'development') {
  router.get('/_clear-tokens', async ctx => {
    await query('TRUNCATE TABLE PRE_tokens;')
    return ctx.body = 'ok'
  })
}

const staticDir = path.resolve(__dirname, '../static')

router.get('/', ctx => {
  if (ctx.state.user) return serveStatic(staticDir)(ctx)
  else ctx.redirect('/welcome')
})
router.get('/_new', async ctx => {
  const user = ctx.requireLogin()
  const generateId = () => `${user.id}/${generateName().dashed}`
  let id = generateId(), tries = 0
  while (await Form.fromId(id) && ++tries < 100) id = generateId()
  if (tries === 100) ctx.throw(418)
  const form = new Form({
    userid: user.id,
    id,
    title: 'Vote',
    pages: [ new Page({ id: 0, questions: [] }) ],
    theme: themes.find(t => t.config.default).config.code,
    plugins: plugins.filter(p => p.config.default),
  })
  await form.save()
  return ctx.redirect(`/${id}/edit`)
})

router.get('/*', serveStatic(staticDir))

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const rt = Date.now() - start
  log.http(ctx, rt)
})
app.use(async (ctx, next) => {
  ctx.state.user = await User.fromContext(ctx)
  await next()
})
app.use(BodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.context.requireLogin = function () {
  if (!this.state.user) this.throw(401)
  return this.state.user
}

try {
  app.listen(parseInt(process.env.PORT), process.env.HOST)
} catch (e) {
  log.error(e.stack)
  process.exit(1)
}

log.info('Server Restart')
