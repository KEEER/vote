/** @module main */

import Koa from 'koa'
import dotenv from 'dotenv'
import * as db from './db'
import {Form} from './form'
import log from './log'
import 'array-flat-polyfill'

// Load env config
dotenv.config()

;(async () => {
  const form = await Form.fromId('id')
  log.info(form)
  // form.id = 'id' + parseInt(Math.random() * 256)
  await form.save()
  log.info('saved')
})()
