/** @module api */

import { readFileSync } from 'fs'
import path from 'path'
import EventEmitter from 'emittery'

// utilities

let state = null
const setState = newState => {
  if (state !== null) throw new Error('Cannot create injection now')
  state = newState
}
const assertState = (...states) => {
  if (!states.includes(state)) throw new Error('This API cannot be called now')
}

export const createServerInjection = cb => {
  setState('server')
  cb()
  state = null
  return form => doServerActions(form)
}
export const createFormInjection = cb => {
  setState('form')
  window.addEventListener('vote:ready', doBrowserActions(cb))
}
export const createEditorInjection = cb => {
  setState('editor')
  window.addEventListener('vote:ready', doBrowserActions(cb))
}

const ee = new EventEmitter()
export const on = (...args) => ee.on(...args)
export const once = (...args) => ee.once(...args)
export const emit = (...args) => ee.emit(...args)

const serverMixinQueue = []
const doServerActions = form => {
  for (const mixin of serverMixinQueue) mixin(form)
  /**
   * Form attached event.
   * @event api.attached
   * @type {module:form~Form}
   */
  emit('attached', form)
}
const browserMixinQueue = []
const doBrowserActions = cb => () => {
  const hooks = window.voteHooks
  cb(hooks)
  for (const mixin of browserMixinQueue) mixin(hooks)
  /**
   * Page loaded
   * @event api.loaded
   * @type {EventEmitter}
   */
  emit('loaded', hooks)
}

const decorateServerApi = fn => (...args) => {
  assertState('server')
  serverMixinQueue.push(fn(...args))
}
const decorateEditorApi = fn => (...args) => {
  assertState('editor')
  browserMixinQueue.push(fn(...args))
}

/**
 * Waits until a predicate.
 * @param {function} predicate called to check the predicate
 * @param {number} [timeout] timeout
 * @returns {Promise<void>} resolved when predicate is true
 */
export const waitUntil = (predicate, timeout) => new Promise((resolve, reject) => {
  if (timeout) setTimeout(() => {
    clearInterval(iid)
    reject('timeout')
  }, timeout)
  const iid = setInterval(() => {
    if (predicate()) {
      clearInterval(iid)
      resolve()
    }
  }, 128)
})

// editor apis

const stylesInjected = {}
/**
 * Injects a stylesheet.
 * @param {string} src stylesheet source
 */
export const injectStyle = src => {
  if (stylesInjected[src]) return
  const el = document.createElement('link')
  el.href = src
  el.rel = 'stylesheet'
  el.type = 'text/css'
  document.head.appendChild(el)
  stylesInjected[src] = true
}

const scriptsInjected = {}

/**
 * Injects a script.
 * @param {string} src stylesheet source
 */
export const injectScript = src => {
  if (scriptsInjected[src]) return
  const el = document.createElement('script')
  el.src = src
  document.head.appendChild(el)
  scriptsInjected[src] = true
}

/**
 * Adds a route into the editor.
 * @function
 * @param {string} route.path pathname
 * @param {any} route.component Vue component
 * @param {string} route.icon MD icon
 * @param {string} route.title route title locale path
 */
export const addEditorRoute = route => {
  assertState('editor', 'server')
  if (state === 'server') {
    serverMixinQueue.push(form => form.editorPaths = [ route.name, ...(form.editorPaths || []) ])
  } else { // browser
    route.path = `/:uname/:name/${route.name}`
    browserMixinQueue.push(hooks => hooks.on('editor:beforeRouterLoad', routes => routes.push(route)))
  }
}

/**
 * @callback addValidationTypeValidatorCallback
 * @param {any} options question data
 * @param {any} value question value
 * @param {object} params parameters, see below
 * @param {string} params.type one of server|form
 * @returns {null|boolean|string}
 */

/**
 * @callback addValidationTypeTipCallback
 * @param {string} failure reason
 * @param {any} question
 * @returns {string} invalid tip
 */

/**
 * Adds a validation type.
 * @function
 * @param {object} options see below
 * @param {string} options.type question type
 * @param {addValidationTypeValidatorCallback} options.validator validate function
 * @param {function} options.entryMixin mixin to insert type into editor
 * @param {string|addValidationTypeTipCallback} options.tip invalid tip
 */
export const addValidationType = ({ type, validator, entryMixin, tip }) => {
  assertState('form', 'editor', 'server')
  if (state === 'server') serverMixinQueue.push(form => {
    form.on('validateQuestionOverride', ({ question, form, ctx, data, invalidate, finalize }) => {
      if (question.options.type !== type) return
      const res = validator(question.options, data[question.id], { type: 'server', form, ctx, question, data })
      if (!res && res !== null) invalidate()
      finalize()
    })
  })
  if (state === 'form') browserMixinQueue.push(hooks => hooks.on('question:validatorOverride', ({ question: q, set }) => {
    if (q.type !== type) return
    const res = validator(q.data, q.value, { type: 'form', question: q })
    if (res === null || typeof res === 'boolean' || typeof res === 'string') {
      set(res)
      if (q.data.config.validation && q.data.config.validation.invalidTip) q.invalidTip = q.data.config.validation.invalidTip
      else if (tip && typeof res === 'string' && (!q.data.config.validation || q.data.config.validation.showValidation !== false)) {
        if (typeof tip === 'string') q.invalidTip = tip
        if (typeof tip[res] === 'string') q.invalidTip = tip[res]
        if (typeof tip === 'function') q.invalidTip = tip(res, q)
      }
    }
  }))
  if (state === 'editor') browserMixinQueue.push(hooks => hooks.on('editor:questionMounted', q => {
    const triggerMixin = type1 => {
      if (type1 === type) {
        entryMixin(q.validationEntries)
        q.updateMenuItems()
      }
    }
    q.$on('update:type', triggerMixin)
    triggerMixin(q.type_)
  }))
}

export { useValidation, showValidation, invalidTip } from '@vote/plugins/ess/common/validationTypes'

/**
 * Adds a question type.
 * @function
 * @param {string} name question type name
 * @param {any} component question component
 */
export const addQuestionType = (name, component) => {
  assertState('editor', 'form')
  browserMixinQueue.push(state === 'editor' ?
    hooks => hooks.on('editor:appMounted', app => app.types[name] = component) :
    hooks => hooks.on('form:mounted', vm => vm.$set(vm.types, name, component)))
}

/**
 * Adds an entry into settings page.
 * @function
 * @param {string} entry.name unique name of the entry
 * @param {any} entry.component Vue component
 * @param {string} entry.title entry title locale path
 */
export const addSettingsEntry = decorateEditorApi(entry => hooks => hooks.on('editor:settingsMounted', vm => {
  vm.entries.every(e => e.name !== entry.name) ? vm.entries.splice(vm.entries.length - 1, 0, entry) : null
}))

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
 * @function
 * @param {addQuestionMenuEntryCallback|QuestionMenuEntry} makeEntry callback to make an entry from vm, or the menu entry itself
 */
export const addQuestionMenuEntry = decorateEditorApi(makeEntry => hooks => {
  hooks.on('editor:questionMounted', vm => vm.$on('update:menuItems', () => {
    const entry = typeof makeEntry === 'function' ? makeEntry(vm) : makeEntry
    if (entry) vm.menuItems.push(entry)
  }))
})

export { default as SettingsEntry } from '../plugins/ess/editor/components/SettingsEntry.vue'

// server apis

/**
 * Reads a file from `dist`.
 * @function
 * @param {string} name filename
 * @returns {string}
 */
export const readDistFile = name => readFileSync(path.resolve(__dirname, '../../dist', name)).toString()

export { query } from '../plugins/ess/common/graphql'

/**
 * @callback addPageCallback
 * @param {Koa.Context} ctx Koa context
 * @param {module:form~Form} form the form
 * @param {string} path the path of the request
 * @returns {number|string|undefined}
 */

/**
 * Adds a page entry to the form.
 * @function
 * @param {string} path path to listen on
 * @param {string|Buffer|addPageCallback} callback the page itself or a callback to get the page
 */
export const addPage = decorateServerApi((path, callback) => form => form.on('getPage', async ({ form, path: path1, ctx, set }) => {
  if (path === path1) {
    const res = typeof callback === 'function' ? await callback(ctx, form, path1) : callback
    if (typeof res !== 'undefined') set(res)
  }
}))

// form apis

export { questionMixin } from './question-mixin'

/**
 * Gets configuration from data with default values.
 * @function
 * @param {object} data question / form data
 * @param {string} kind configuration type (e.g. 'theme', 'settings', etc.)
 * @param {string} name config entry name
 * @param {any} defaultValue default value for config
 */
export const getConfig = (data, kind, name, defaultValue) => {
  if (!data) return defaultValue
  if (data.is === 'Form') data = { config: data.options.data }
  // Badly wanted to use ?. but it is not supported by Vue right now :(
  if (!data.config || !data.config[kind] || typeof data.config[kind][name] === 'undefined') return defaultValue
  return data.config[kind][name]
}

/**
 * Sets configuration to data object.
 * @function
 * @param {object} data question / form data
 * @param {string} kind configuration type (e.g. 'theme', 'settings', etc.)
 * @param {string} name config entry name
 * @param {any} value value to set
 */
export const setConfig = (data, kind, name, value) => {
  if (!data.config) return data.config = { [kind]: { [name]: value } }
  else if (!data.config[kind]) return data.config[kind] = { [name]: value }
  return data.config[kind][name] = value
}
