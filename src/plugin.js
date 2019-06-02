/** @module plugin */
import fs from 'fs'
import path from 'path'

// TODO: import plugin files for backend

/** Class representing a plugin. */
class Plugin {
  /**
   * Creates a plugin object.
   * @param {Object} config The configuration JSON object
   */
  constructor(config) {
    this.config = config
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

let pluginDirs, plugins, js
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
  plugins = pluginDirs.map(dir => {
    const pluginJson = fs.readFileSync(path.resolve(__dirname, 'plugins', dir, 'plugin.json'))
    const plugin = JSON.parse(pluginJson.toString())
    if(plugin.entryName) {
      plugin.jsPath = js.find(f => f.startsWith(plugin.entryName) && f.endsWith('.js'))
    }
    return new Plugin(plugin)
  })
} catch(e) {
  throw new Error(`Error parsing plugins: ${e}`)
}

export default plugins
export {
  pluginDirs,
  plugins,
}
