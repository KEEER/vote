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
}

if (!(script in fns)) {
  console.log(`Script ${script} not found. All scripts:`)
  console.log(Object.keys(fns).join(', '))
  process.exit(1)
}

fns[script]()
