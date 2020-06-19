export const types =
  typeof window === 'undefined' ?
    require('yaml').parse(require('fs').readFileSync(require('path').resolve(__dirname, 'types.yml')).toString()) : // eslint-disable-line import/order
    JSON.parse(require('raw-loader!yaml-loader!./types.yml').default)
export const typeKeys = Object.keys(types)
export const walkStrings = (object, $t) => {
  if (typeof object !== 'object') return object
  for (let key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue
    if (key.startsWith('__')) {
      const translation = $t(key.substr(2))
      object[translation] = object[key]
      delete object[key]
      key = translation
    }
    if (typeof object[key] === 'string' && object[key].startsWith('__')) object[key] = $t(object[key].substr(2))
    else if (typeof object[key] === 'object') walkStrings(object[key], $t)
  }
  return object
}
for (const type of Object.values(types)) {
  if ('validation' in type) {
    type.config = { ...(type.config || {}), validation: type.validation }
    delete type.validation
  }
}
