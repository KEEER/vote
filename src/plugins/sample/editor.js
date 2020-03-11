import SampleEntry from './SampleEntry.vue'
import { editorRouteMixin, addValidationMixin } from './common'
import { addSettingsEntry, addQuestionMenuEntry, addQuestionType, createEditorInjection } from '@vote/api'

createEditorInjection(hooks => {
  addSettingsEntry({
    name: 'sample-entry',
    title: 'plugin.sample.settings.sample',
    component: SampleEntry,
  })
  addQuestionMenuEntry({
    icon: 'signal_wifi_off',
    label: 'plugin.sample.questionMenu.sample',
    handler: vm => alert(vm.title_),
  })
  editorRouteMixin()
  addValidationMixin()
  addQuestionType('VSample', SampleEntry)
  hooks.on('editor:appMounted', ([ app ]) => {
    app.documentTitle = 'Sample Vote'
    app.updateTitle()
  })
})
