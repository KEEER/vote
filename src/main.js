/** @module main */

import Koa from 'koa'
import dotenv from 'dotenv'
import * as db from './db'
import {Form, Page} from './form'
import log from './log'
import 'array-flat-polyfill'
import Question from './question'

// Load env config
dotenv.config()

;(async () => {
  const q = new Question({
    type: 'VText',
    id: 1,
    value: 'i',
    title: 'titl'
  })
  const p = new Page({
    title: 'page',
    id: 1,
    questions: [q],
  })
  const form = new Form({
    title: 'f',
    id: '233',
    pages: [p],
    userid: 'Alan-Liang',
    theme: 'theme'
  })
  await form.save()
  log.info('saved')
})()
