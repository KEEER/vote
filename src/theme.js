/** @module theme */
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

/** Class representing a theme. */
class Theme {
  /**
   * Creates a theme object.
   * @param {Object} config The configuration JSON object
   */
  constructor (config) {
    this.is = 'theme'
    this.config = config
  }

  toJSON () { return this.config }
}

// load themes
let themeDirs, themes // eslint-disable-line import/no-mutable-exports
try {
  themeDirs = fs.readdirSync(path.resolve(__dirname, 'themes'))
} catch (e) {
  throw new Error(`Error reading theme directories: ${e}`)
}

try {
  themes = themeDirs.map(dir => {
    const themeConfigBuffer = fs.readFileSync(path.resolve(__dirname, 'themes', dir, 'theme.yml'))
    const theme = YAML.parse(themeConfigBuffer.toString())
    return new Theme(theme)
  })
} catch (e) {
  throw new Error(`Error parsing themes: ${e}`)
}

export default themes
export {
  themeDirs,
  themes,
}
