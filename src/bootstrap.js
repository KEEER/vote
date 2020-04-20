module.exports = loadBabel => {
  // Load env config before anything else
  require('dotenv').config()

  // monkeypatching node Module
  // see: https://github.com/patrick-steele-idem/require-self-ref/blob/master/src/index.js
  const Module = require('module')
  const path = require('path')
  const oldResolveFilename = Module._resolveFilename
  const srcPath = __dirname
  Module._resolveFilename = function (request, parent, isMain) {
    if (request.startsWith('@vote/')) {
      let req = request
      if (request.startsWith('@vote/core')) req = req.replace('@vote/core', srcPath)
      if (request.startsWith('@vote/api')) req = req.replace('@vote/api', path.resolve(srcPath, 'api'))
      if (request.startsWith('@vote/plugins/')) req = req.replace('@vote/plugins', path.resolve(srcPath, 'plugins'))
      if (request.startsWith('@vote/themes/')) req = req.replace('@vote/themes', path.resolve(srcPath, 'themes'))
      if (request.startsWith('@vote/locale')) req = req.replace('@vote/locale', path.resolve(__dirname, '../locale'))
      return oldResolveFilename.call(this, req, parent, isMain)
    }
    return oldResolveFilename.call(this, request, parent, isMain)
  }
  Module._extensions['.vue'] = () => {}

  if (loadBabel) {
    require('regenerator-runtime/runtime')
    require('@babel/register')({ ignore: [ /buffer/ ] })
  }
}
