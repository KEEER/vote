/** @module theme */
import fs from 'fs'
import path from 'path'

/** Class representing a theme. */
class Theme {
  /**
   * Creates a theme object.
   * @param {Object} config The configuration JSON object
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Check if the question/plugin could be used with the theme.
   * @param {module:question~Question|module:plugin~Plugin} obj The Question/Plugin object
   * @returns {boolean}
   */
  applicable(obj) {
    // TODO
  }
}

let themeDirs, themes
try {
  themeDirs = fs.readdirSync(path.resolve(__dirname, 'themes'))
} catch(e) {
  throw new Error(`Error reading theme directories: ${e}`)
}

try {
  themes = themeDirs.map(dir => {
    const themeJson = fs.readFileSync(path.resolve(__dirname, 'themes', dir, 'theme.json'))
    const theme = JSON.parse(themeJson.toString())
    return new Theme(theme)
  })
} catch(e) {
  throw new Error(`Error parsing themes: ${e}`)
}

export default themes
export {
  themeDirs,
  themes,
}
