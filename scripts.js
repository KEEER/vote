const fs = require('fs-extra')
const tar = require('tar')

const script = process.argv[2]
if (!script) {
  console.log('Usage: node ./scripts <script>')
  process.exit(1)
}

const fns = {
  clean () {
    fs.removeSync('dist/js')
    fs.removeSync('dist/css')
    fs.removeSync('dist.tgz')

    try {
      const htmlFiles = fs.readdirSync('dist').filter(f => f.endsWith('.html'))
      for (let f of htmlFiles) fs.removeSync(`dist/${f}`)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },

  'clean:cache' () {
    fs.removeSync('.webpack-cache')
  },

  async pack () {
    try {
      const htmlFiles = fs.readdirSync('dist').filter(f => f.endsWith('.html')).map(f => `dist/${f}`)
      await tar.c({ gzip: true, file: 'dist.tgz' }, [ 'dist/js', 'dist/css', ...htmlFiles ])
    } catch (e) {
      console.log(`Failed creating pack: ${e}`)
      process.exit(-1)
    }
  },

  'kas-mock' () {
    const Koa = require('koa')
    const Router = require('koa-router')
    const app = new Koa()
    const router = new Router()
    app.use(router.routes()).use(router.allowedMethods())
    router.post('/api/auth/query_information', ctx => {
      console.log('query-information')
      ctx.set('Access-Control-Allow-Origin', '*')
      // I have no idea why KAS responses are so ugly
      ctx.body = {
        status: 0,
        result: {
          status: 0,
          result: {
            avatar: 'https://keeer.net/img/logo/dark-square.jpg',
            nickname: 'KEEER',
            keeer_id: 'keeer',
          },
        },
      }
    })
    router.post('/api/auth/examine_token', ctx => ctx.body = {
      status: 0,
      result: { status: 0 },
    })
    app.listen(8081)
    console.log('Listening on http://localhost:8081/')
  },

  async 'build:html' () {
    const ejs = require('ejs')
    const { messages } = require('./locale')
    const languages = Object.keys(messages)
    let lang
    const $t = m => {
      const slices = m.split('.')
      let message = messages[lang]
      for (let s of slices) message = message[s] || m
      return message
    }
    const ejsEntries = [ 'index', 'set-id', '404', '500' ]
    const data = { $t }
    const opts = {
      root: './ejs',
      rmWhitespace: true,
      async: true,
    }
    for (let entry of ejsEntries) {
      for (lang of languages) {
        fs.writeFileSync(`./dist/${lang}-${entry}.html`, await ejs.renderFile(`./ejs/${entry}.ejs`, data, opts))
      }
    }
  },

  async 'build:compat' () {
    const req = require('esm')(module, { cjs: { dedefault: true } })
    const plugins = req('./src/plugin').plugins
    const themes = req('./src/theme').themes
    const Form = req('./src/form').Form
    const form = new Form({ pages: [] })
    const requiredPlugins = plugins.filter(p => p.config.required)
    const nonRequiredPlugins = plugins.filter(p => !p.config.required)
    const objectsToDfs = [ ...nonRequiredPlugins, ...themes ]
    const table = {}
    const sort = ([ theme, ...plugin ]) => ([ theme, ...plugin.sort((a, b) => plugins.indexOf(a) - plugins.indexOf(b)) ])
    const stringify = ([ theme, ...plugin ]) => ([ `theme:${theme.config.code}`, ...plugin.map(o => o.config.code) ].join('/'))
    const dfs = (base = [ themes.find(t => t.config.default), ...requiredPlugins ]) => {
      base = sort(base)
      const stringBase = stringify(base)
      console.log('[dfs]', stringBase)
      const [ baseTheme, ...basePlugins ] = base
      for (let object of objectsToDfs) {
        form.options.plugins = basePlugins
        form.options.theme = baseTheme.config.code
        if (!table[stringBase]) table[stringBase] = []
        if (table[stringBase].indexOf(object) > -1) continue
        const contains = base.indexOf(object) > -1
        if (!contains && form.isApplicable(object)) {
          table[stringBase].push(object)
          if (object.is === 'theme') {
            dfs([ object, ...basePlugins ])
          } else if (object.is === 'plugin') {
            dfs([ ...base, object ])
          }
        }
        if (contains && object.is === 'plugin' && !form.isRequired(object)) {
          table[stringBase].push(object)
          dfs([ baseTheme, ...basePlugins.filter(p => p !== object) ])
        }
      }
    }
    dfs()
    for (let k in table) table[k] = table[k].map(o => o.is === 'theme' ? `theme:${o.config.code}` : o.config.code).join('/')
    require('fs-extra').ensureDirSync('dist')
    require('fs').writeFileSync('dist/compat.json', JSON.stringify(table))
  },
}

if (!(script in fns)) {
  console.log(`Script ${script} not found. All scripts:`)
  console.log(Object.keys(fns).join(', '))
  process.exit(1)
}

fns[script]()
