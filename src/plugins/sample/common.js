import SampleEntry from './SampleEntry.vue'
import { addEditorRoute, getConfig, invalidTip, showValidation, useValidation, addValidationType } from '@vote/api'

export const editorRouteMixin = () => addEditorRoute({
  name: 'sample',
  component: SampleEntry,
  icon: 'lock',
  title: 'plugin.sample.route.sample',
})

export const addValidationMixin = () => addValidationType({
  type: 'VSample',
  validator: q => getConfig(q, 'validation', 'useValidation', false) ? 'always-invalid' : null,
  entryMixin: e => e.push(useValidation, {
    type: 'text-field',
    if: cfg => cfg.useValidation,
    label: 'core.question.types.VSample',
    name: 'sample',
  }, showValidation, invalidTip),
  tip: (reason, q) => reason + q.data.config.validation.sample,
})
