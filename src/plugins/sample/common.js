import { addEditorRoute, invalidTip, showValidation, useValidation } from '@vote/api'
import SampleEntry from './SampleEntry.vue'
import { addValidationType } from '../../api'

export const editorRouteMixin = () => addEditorRoute({
  name: 'sample',
  component: SampleEntry,
  icon: 'lock',
  title: 'plugin.sample.route.sample',
})

export const addValidationMixin = () => addValidationType(
  'VSample',
  q => q.config && q.config.validation && q.config.validation.useValidation ? 'always-invalid' : null,
  e => e.push(useValidation, {
    type: 'text-field',
    if: value => value.useValidation,
    label: 'core.question.types.VSample',
    name: 'sample',
  }, showValidation, invalidTip),
  (reason, q) => reason + q.data.config.validation.sample
)
