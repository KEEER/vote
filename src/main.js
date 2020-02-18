/** @module main */
import 'array-flat-polyfill'
import path from 'path'
import log from './log'
import { Form } from './form'
import Koa from 'koa'
import Router from 'koa-router'
import BodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import { User } from './user'

const app = new Koa()
const router = new Router()

router.get('/js/*', serveStatic(path.resolve(__dirname, '../dist')))
router.get('/css/*', serveStatic(path.resolve(__dirname, '../dist')))

router.all('/:uid/:id/:pid?', async ctx => {
  const user = await User.fromContext(ctx)
  ctx.user = user
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

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const rt = Date.now() - start
  log.http(ctx, rt)
})
app.use(BodyParser())
app.use(router.routes()).use(router.allowedMethods())

try {
  app.listen(parseInt(process.env.PORT), process.env.HOST)
} catch (e) {
  log.error(e.stack)
  process.exit(1)
}

log.info('Server Restart')
