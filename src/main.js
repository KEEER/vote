import Koa from 'koa'
import dotenv from 'dotenv'
import * as db from './db'
import log from './log'

// Load env config
dotenv.config()

;(async () => {
  log.warn(await db.query('SELECT NOW()'))
})()
