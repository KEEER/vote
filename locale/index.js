import enStr from 'raw-loader!yaml-loader!./en.yml'
import zhStr from 'raw-loader!yaml-loader!./zh.yml'

const en = JSON.parse(enStr), zh = JSON.parse(zhStr)
export const messages = { en, zh }
let navLocale = navigator.language.slice(0, 2).toLowerCase()
if (!(navLocale in messages)) {
  navLocale = 'en'
  messages.en.isFallback = 'true'
}
export const locale = navLocale
