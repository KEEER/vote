require('dotenv').config()
// eslint-disable-next-line no-global-assign
require = require('esm')(module, { cjs: { dedefault: true } })
global.query = require('./src/db').query
global.Form = require('./src/form').Form
global.Page = require('./src/form').Page
global.log = require('./src/log').child({ part: 'repl' })
global.plugins = require('./src/plugin').plugins
global.themes = require('./src/theme').themes
global.Question = require('./src/question')
global.User = require('./src/user').User
global.form1 = new Form({ userid: 'Alan-Liang', id: 'Alan-Liang/t', title: 'Vote', pages: [ new Page({ id: 0, questions: [] }) ], theme: 'basic', plugins: [ plugins.find(p => p.config.code === 'ess') ] })
