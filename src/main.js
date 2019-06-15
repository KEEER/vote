/** @module main */
import 'array-flat-polyfill'
import path from 'path'
import log from './log'
import {Form} from './form'
import Koa from 'koa'
import Router from 'koa-router'
import Session from 'koa-session'
import BodyParser from 'koa-bodyparser'
import serveStatic from 'koa-static'
import {query} from './db'

const maxAge = parseInt(process.env.SESSION_MAXAGE)

// Session store
const store = {
  async get(key) {
    const res = await query('SELECT data FROM PRE_session WHERE id = $1;', [key])
    if(res.rows.length === 0) return false
    else return res.rows[0].data
  },
  async set(key, data, maxAge1) {
    const expiry = (Date.now() + maxAge1 || maxAge) / 1000
    // TODO: atomicity
    if(await this.get(key)) {
      await query('UPDATE PRE_session SET data = $3, expiry = to_timestamp($2) WHERE id = $1;', [key, expiry, data])
    } else {
      await query('INSERT INTO PRE_session(id, expiry, data) VALUES($1, to_timestamp($2), $3);', [key, expiry, data])
    }
  },
  async destroy(key) {
    await query('DELETE FROM PRE_session WHERE id = $1;', [key])
  },
  async clean() {
    await query('DELETE FROM PRE_session WHERE expiry <= to_timestamp($1);', [Date.now() / 1000])
  },
}
setInterval(store.clean, parseInt(process.env.SESSION_CLEAN_INTERVAL))

const app = new Koa()
const router = new Router()

router.get('/js/*', serveStatic(path.resolve(__dirname, '../dist')))
router.get('/css/*', serveStatic(path.resolve(__dirname, '../dist')))

router.all('/:uid/:id/:pid?', async ctx => {
  const id = ctx.params.uid + '/' + ctx.params.id
  const form = await Form.fromId(id)
  if(form === null) {
    // TODO: handle these cases
    ctx.status = 404
    return
  }
  ctx.status = 200
  const resp = await form.getPage(ctx.params.pid || '', ctx)
  if(resp === null) {
    ctx.status = 404
    return
  }
  if(typeof resp === 'number') {
    ctx.status = resp
    return
  }
  if(typeof resp === 'string') {
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
app.use(Session({
  key: process.env.SESSION_KEY,
  maxAge,
  store,
  signed: false,
}, app))
app.use(router.routes()).use(router.allowedMethods())

app.listen(parseInt(process.env.PORT), process.env.HOST)
