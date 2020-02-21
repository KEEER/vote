const loader = name => typeof window === 'undefined' ?
  require('yaml').parse(require('fs').readFileSync(require('path').resolve(__dirname, name)).toString()) :
  JSON.parse(require(`raw-loader!yaml-loader!./${name}`).default)

const en = loader('en.yml'), zh = loader('zh.yml')
const messages = exports.messages = { en, zh }
const nav = typeof navigator === 'undefined' ? { language: 'en-US' } : navigator
let navLocale = nav.language.slice(0, 2).toLowerCase()
if (!(navLocale in messages)) {
  navLocale = 'en'
  messages.en.isFallback = 'true'
}
exports.locale = navLocale
