import fs from 'fs'
import path from 'path'

/// <reference path="question.js" />
/// <reference path="plugin.js" />

/** 
 * Class representing a theme.
 * @typedef Theme
 */
class Theme {
  /**
   * Create a theme object.
   * @param {object} config The configuration JSON object
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Check if the question/plugin could be used in the theme.
   * @param {Question|Plugin} obj The Question/Plugin object
   */
  applicable(obj) {
    // TODO: form
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

/** Themes are exported. */
export default themes
export {
  themeDirs,
  themes
}
