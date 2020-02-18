import enStr from 'raw-loader!yaml-loader!./en.yml'
import zhStr from 'raw-loader!yaml-loader!./zh.yml'

const en = JSON.parse(enStr), zh = JSON.parse(zhStr)
export const messages = { en, zh }
export const locale = navigator.language.slice(0, 2).toLowerCase()