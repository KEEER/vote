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
    const requiredPlugins = plugins.filter(p => p.config.required)
    const nonRequiredPlugins = plugins.filter(p => !p.config.required)
    const themes = req('./src/theme').themes
    const Form = req('./src/form').Form
    const form = new Form({ pages: [] })
    const table = {}
    const map = arr => {
      const map = {}
      for (let i of arr) if (!map[i[0]] || map[i[0]].indexOf(i[1]) < 0) {
        map[i[0]] = [ ...(map[i[0]] || []), i[1] ]
      }
      return map
    }
    for (let theme of themes) {
      form.options.theme = theme.config.code
      const gen = function* (prev = []) {
        for (let plugin of nonRequiredPlugins) {
          const pluginsNow = [ ...requiredPlugins, ...prev ]
          yield* requiredPlugins.map(p => [ pluginsNow, p ])
          form.options.plugins = pluginsNow
          const isIn = prev.find(p => p.config.code === plugin.config.code)
          if (!isIn && form.isApplicable(plugin)) {
            yield [ pluginsNow, plugin ]
            yield* gen([ ...prev, plugin ])
          }
          if (isIn && form.isRequired(plugin)) {
            yield [ pluginsNow, plugin ]
          }
        }
      }
      const mapping = map(Array.from(gen()).map(([ a, b ]) => [ a.map(a => a.config.code).sort().join('/'), b.config.code ]))
      for (let k in mapping) {
        mapping[k] = [ ...themes.filter(t => {
          form.options.plugins = k.split('/').map(c => plugins.find(p => p.config.code === c))
          return t.config.code !== theme.config.code && form.isApplicable(t)
        }).map(t => `theme:${t.config.code}`), ...mapping[k] ]
        table[`theme:${theme.config.code}/${k}`] = mapping[k].join('/')
      }
    }
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
