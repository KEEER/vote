/** @module api */

/**
 * Adds a route into the editor.
 * @param {string} route.path pathname
 * @param {any} route.component Vue component
 * @param {string} route.icon MD icon
 * @param {string} route.title route title locale path
 */
export const addEditorRoute = route => {
  route.path = `/:uname/:name/${route.name}`
  if (typeof window === 'undefined') { // server
    return form => form.editorPaths = [ route.name, ...(form.editorPaths || []) ]
  } else { // browser
    return hooks => hooks.on('editor:beforeRouterLoad', ([ routes ]) => routes.push(route))
  }
}

/**
 * Adds an entry into settings page.
 * @param {string} entry.name unique name of the entry
 * @param {any} entry.component Vue component
 * @param {string} entry.title entry title locale path
 */
export const addSettingsEntry = entry => hooks => {
  hooks.on('editor:settingsMounted', ([ { entries } ]) => entries
    .some(e => e.name === entry.name) ? null : entries.splice(entries.length - 1, 0, entry))
}

/**
 * @callback questionMenuEntryHandler
 * @param {any} vm Vue model
 */

/**
 * @typedef QuestionMenuEntry
 * @property {string} icon MD icon
 * @property {string} label entry title locale path
 * @property {questionMenuEntryHandler} handler triggered on click
 */

/**
 * @callback addQuestionMenuEntryCallback
 * @param {any} vm Vue model
 * @returns {QuestionMenuEntry|undefined}
 */

/**
 * Adds a question menu entry.
 * @param {addQuestionMenuEntryCallback|QuestionMenuEntry} makeEntry callback to make an entry from vm, or the menu entry itself
 */
export const addQuestionMenuEntry = makeEntry => hooks => {
  hooks.on('editor:questionMounted', ([ vm ]) => {
    const entry = typeof makeEntry === 'function' ? makeEntry(vm) : makeEntry
    if (entry) vm.menuItems.push(entry)
  })
}

export { default as SettingsEntry } from '../plugins/ess/editor/components/SettingsEntry.vue'
