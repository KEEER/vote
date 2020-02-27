/** @module main */
import 'array-flat-polyfill'
import path from 'path'
import logger from './log'
import { Form, Page } from './form'
import Koa from 'koa'
import Router from 'koa-router'
import BodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { User, UserNoIdError } from './user'
import generateName from 'project-name-generator'
import acceptLanguageParser from 'accept-language-parser'
import { HttpError } from 'http-errors'
import { messages as localeMessages } from '../locale'
import { query } from './db'
import { plugins } from './plugin'
import { themes } from './theme'

const log = logger.child({ part: 'main' })

const app = new Koa()
const router = new Router()
const staticDir = path.resolve(__dirname, '../static')
const distDir = path.resolve(__dirname, '../dist')
const staticServer = serveStatic(staticDir)
const distServer = serveStatic(distDir)
const languages = Object.keys(localeMessages)
const distLangServer = async (ctx, next) => {
  if (ctx.path.split('/').length > 2) return await next()
  const acceptLanguage = ctx.get('accept-language')
  const lang = acceptLanguage ? acceptLanguageParser.pick(languages, acceptLanguage) : 'en'
  const path = ctx.path
  ctx.path = `/${lang}-${path.split('/')[1] || 'index'}.html`
  return await distServer(ctx, (...args) => {
    ctx.path = path
    return next(...args)
  })
}

export const interrupt = new Error('interrupt')

router.get('/js/(.*)', distServer)
router.get('/css/(.*)', distServer)

router.all('/:uname/:name/:path?', async ctx => {
  const form = await Form.fromName(ctx.params.uname, ctx.params.name)
  if (form === null) return ctx.throw(404)
  ctx.state.form = form
  ctx.status = 200
  const resp = await form.getPage(ctx.params.path || '', ctx)
  if (resp === null) return ctx.throw(404)
  if (typeof resp === 'number') return ctx.status = resp
  if (typeof resp === 'string') return ctx.body = resp
  throw new TypeError(`typeof resp is ${typeof resp}, expected null|number|string`)
})

router.get('/_forms', async ctx => {
  const user = ctx.requireLogin()
  const forms = await Form.fromUserId(user.id)
  if (!forms) return ctx.body = []
  const formDatas = await Promise.all(forms.map(async f => ({
    name: f.options.name,
    userName: f.options.userName,
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

router.get('/', (ctx, next) => {
  if (ctx.state.user) return staticServer(ctx, next)
  else {
    if (ctx.state.userNoId) ctx.requireLogin()
    else ctx.redirect('/welcome')
  }
})
router.get('/_new', async ctx => {
  const user = ctx.requireLogin()
  let name = generateName().dashed, tries = 0
  while (await Form.exists(user.id, name) && ++tries < 100) name = generateName().dashed
  if (tries === 100) ctx.throw(418)
  const form = new Form({
    userId: user.id,
    userName: user.name,
    name,
    title: 'Vote',
    pages: [ new Page({ id: 0, questions: [] }) ],
    theme: themes.find(t => t.config.default).config.code,
    plugins: plugins.filter(p => p.config.default),
  })
  await form.save()
  return ctx.redirect(`/${form.path}/edit`)
})

router.get('/(.*)', distLangServer)
router.get('/(.*)', staticServer)
router.get('/(.*)', (ctx, next) => {
  ctx.path += '.html'
  return staticServer(ctx, next)
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const rt = Date.now() - start
  log.http(ctx, rt)
})
app.use(async (ctx, next) => {
  const processError = (e = ctx) => {
    const status = e.statusCode || e.status
    ctx.status = status
    ctx.path = `/${status}`
    return distLangServer(ctx, next)
  }
  try {
    ctx.state.user = await User.fromContext(ctx)
  } catch (e) {
    ctx.state.user = null
    if (e instanceof UserNoIdError) ctx.state.userNoId = true
  }
  try {
    await next()
  } catch (e) {
    if (e === interrupt) return
    if (e instanceof HttpError) {
      if (e.statusCode === 404 || e.statusCode === 500) return processError(e)
      else throw e
    } else {
      log.error(e)
      return processError({ status: 500 })
    }
  }
  if (ctx.status === 404 || ctx.status === 500) return processError()
})
app.use(BodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.context.requireLogin = function () {
  if (!this.state.user) {
    if (this.state.userNoId) {
      this.redirect('/set-id')
      throw interrupt
    }
    else this.throw(401)
  }
  return this.state.user
}

try {
  app.listen(parseInt(process.env.PORT), process.env.HOST)
} catch (e) {
  log.error(e.stack)
  process.exit(1)
}

log.info('Server Restart')
