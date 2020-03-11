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
  emit('attached', [ form ])
}
const browserMixinQueue = []
const doBrowserActions = cb => () => {
  const hooks = window.voteHooks
  cb(hooks)
  for (const mixin of browserMixinQueue) mixin(hooks)
  emit('loaded', [ hooks ])
}

const decorateServerApi = fn => (...args) => {
  assertState('server')
  serverMixinQueue.push(fn(...args))
}
const decorateEditorApi = fn => (...args) => {
  assertState('editor')
  browserMixinQueue.push(fn(...args))
}

// editor apis

/**
 * Adds a route into the editor.
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
    browserMixinQueue.push(hooks => hooks.on('editor:beforeRouterLoad', ([ routes ]) => routes.push(route)))
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
 * @param {string} type question type
 * @param {addValidationTypeValidatorCallback} validator validate function
 * @param {function} entryMixin mixin to insert type into editor
 * @param {string|addValidationTypeTipCallback} tip invalid tip
 */
export const addValidationType = (type, validator, entryMixin, tip) => {
  assertState('form', 'editor', 'server')
  if (state === 'server') serverMixinQueue.push(form => {
    form.on('validateQuestionOverride', ([ question, form, ctx, data, cancel, finalize ]) => {
      if (question.options.type !== type) return
      const res = validator(question.options, data[question.id], { type: 'server', form, ctx, question, data })
      if (!res && res !== null) cancel()
      finalize()
    })
  })
  if (state === 'form') browserMixinQueue.push(hooks => hooks.on('question:validatorOverride', ([ q, set ]) => {
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
  if (state === 'editor') browserMixinQueue.push(hooks => hooks.on('editor:questionMounted', ([ q ]) => {
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
 * @param {string} name question type name
 * @param {any} component question component
 */
export const addQuestionType = (name, component) => {
  assertState('editor', 'form')
  browserMixinQueue.push(state === 'editor' ?
    hooks => hooks.on('editor:appMounted', ([ app ]) => app.types[name] = component) :
    hooks => hooks.on('form:mounted', ([ vm ]) => vm.$set(vm.types, name, component)))
}

/**
 * Adds an entry into settings page.
 * @param {string} entry.name unique name of the entry
 * @param {any} entry.component Vue component
 * @param {string} entry.title entry title locale path
 */
export const addSettingsEntry = decorateEditorApi(entry => hooks => {
  hooks.on('editor:settingsMounted', ([ { entries } ]) => entries
    .some(e => e.name === entry.name) ? null : entries.splice(entries.length - 1, 0, entry))
})

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
export const addQuestionMenuEntry = decorateEditorApi(makeEntry => hooks => {
  hooks.on('editor:questionMounted', ([ vm ]) => vm.$on('update:menuItems', () => {
    const entry = typeof makeEntry === 'function' ? makeEntry(vm) : makeEntry
    if (entry) vm.menuItems.push(entry)
  }))
})

export { default as SettingsEntry } from '../plugins/ess/editor/components/SettingsEntry.vue'

// server apis

/**
 * Reads a file from `dist`.
 * @param {string} name filename
 * @returns {string}
 */
export const readDistFile = (name) => readFileSync(path.resolve(__dirname, '../../dist', name)).toString()

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
 * @param {string} path path to listen on
 * @param {string|Buffer|addPageCallback} callback the page itself or a callback to get the page
 */
export const addPage = decorateServerApi((path, callback) => form => form.on('getPage', async ([ form, path1, ctx, set ]) => {
  if (path === path1) {
    const res = typeof callback === 'function' ? await callback(ctx, form, path1) : callback
    if (typeof res !== 'undefined') set(res)
  }
}))

// form apis

export { questionMixin } from './question-mixin'
