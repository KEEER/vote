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
    const ejsEntries = [ 'index', 'set-id' ]
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
}

if (!(script in fns)) {
  console.log(`Script ${script} not found. All scripts:`)
  console.log(Object.keys(fns).join(', '))
  process.exit(1)
}

fns[script]()
