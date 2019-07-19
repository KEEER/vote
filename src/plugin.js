/** @module plugin */
import fs from 'fs'
import path from 'path'

/** Class representing a plugin. */
class Plugin {
  /**
   * Creates a plugin object.
   * @param {Object} config The configuration JSON object
   */
  constructor(config, attachTo) {
    this.config = config
    this.attachTo = attachTo || (() => {})
  }

  /**
   * Check if the question/theme could be used with the plugin.
   * @param {module:question~Question|module:theme~Theme} obj The Question/Theme object
   * @returns {boolean}
   */
  applicable(obj) {
    // TODO
  }
}

let pluginDirs, plugins, js, css
try {
  pluginDirs = fs.readdirSync(path.resolve(__dirname, 'plugins'))
} catch(e) {
  throw new Error(`Error reading plugin directories: ${e}`)
}
try {
  js = fs.readdirSync(path.resolve(__dirname, '../dist/js'))
} catch(e) {
  throw new Error(`Error reading JS build directory: ${e}`)
}
try {
  css = fs.readdirSync(path.resolve(__dirname, '../dist/css'))
} catch(e) {
  throw new Error(`Error reading CSS build directory: ${e}`)
}

try {
  plugins = pluginDirs.map(dir => {
    const pluginJson = fs.readFileSync(path.resolve(__dirname, 'plugins', dir, 'plugin.json'))
    const plugin = JSON.parse(pluginJson.toString())
    let attachTo
    if(plugin.uses.inject.js) {
      plugin.jsPath = js.find(f => f.startsWith(plugin.uses.inject.js) && f.endsWith('.js'))
    }
    if(plugin.uses.inject.css) {
      plugin.cssPath = css.find(f => f.startsWith(plugin.uses.inject.css) && f.endsWith('.css'))
    }
    if(plugin.uses.inject.server) {
      attachTo = require(
        path.resolve(
          __dirname,
          'plugins',
          dir,
          plugin.uses.inject.server,
        )
      )
    }
    return new Plugin(plugin, attachTo)
  })
} catch(e) {
  throw new Error(`Error parsing plugins: ${e.stack}`)
}

export default plugins
export {
  pluginDirs,
  plugins,
}
