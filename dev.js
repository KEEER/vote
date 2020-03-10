require('dotenv').config()
require('./src/load-babel')
global.query = require('./src/db').query
global.Form = require('./src/form').Form
global.Page = require('./src/form').Page
global.log = require('./src/log').default.child({ part: 'repl' })
global.plugins = require('./src/plugin').plugins
global.themes = require('./src/theme').themes
global.Question = require('./src/question').default
global.User = require('./src/user').User
global.form1 = new Form({ id: 1, userId: 1, name: 't', title: 'Vote', pages: [ new Page({ id: 0, questions: [] }) ], theme: 'basic', plugins: [ plugins.find(p => p.config.code === 'ess') ] })
