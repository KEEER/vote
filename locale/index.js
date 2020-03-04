const loader = name => typeof window === 'undefined' ?
  require('yaml').parse(require('fs').readFileSync(require('path').resolve(__dirname, name)).toString()) :
  JSON.parse(require(`raw-loader!yaml-loader!./${name}.yml`).default)

const en = loader('en'), zh = loader('zh')
const messages = exports.messages = { en, zh }
const nav = typeof navigator === 'undefined' ? { language: 'en-US' } : navigator
let navLocale = nav.language.slice(0, 2).toLowerCase()
if (!(navLocale in messages)) {
  navLocale = 'en'
  messages.en.isFallback = 'true'
}
exports.locale = navLocale
