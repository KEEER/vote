/** @module main */

import dotenv from 'dotenv'
import * as db from './db'
import {Form, Page} from './form'
import log from './log'
import plugins from './plugin'
import 'array-flat-polyfill'
import Question from './question'
import themes from './theme'

// Load env config
dotenv.config()

;(async () => {
  const q = new Question({
    type: 'VText',
    id: 1,
    value: 'i',
    title: 'titl',
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
    theme: 'basic',
    plugins: [plugins.find(p => p.config.code === 'sample')],
  })
  log.debug(await form.getPage('whatever'))
  log.debug(await form.getPage('fill'))
  log.debug(await form.bundle())
})()
