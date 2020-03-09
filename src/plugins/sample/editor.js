import SampleEntry from './SampleEntry.vue'
import { editorRouteMixin } from './common'
import { addSettingsEntry, addQuestionMenuEntry } from '@vote/api/editor'

const settingsEntryMixin = addSettingsEntry({
  name: 'sample-entry',
  title: 'plugin.sample.settings.sample',
  component: SampleEntry,
})

const questionMenuMixin = addQuestionMenuEntry({
  icon: 'signal_wifi_off',
  label: 'plugin.sample.questionMenu.sample',
  handler: vm => alert(vm.title_),
})

window.addEventListener('vote:ready', () => {
  editorRouteMixin(window.voteHooks)
  settingsEntryMixin(window.voteHooks)
  questionMenuMixin(window.voteHooks)
  window.voteHooks
    .on('editor:appMounted', ([ app ]) => {
      app.documentTitle = 'Sample Vote'
      app.types.VSample = SampleEntry
      app.updateTitle()
    })
})
