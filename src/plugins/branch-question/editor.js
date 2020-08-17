import branchQuestionEditor from './BranchQuestionEditor'
import { addQuestionMenuEntry, createEditorInjection, injectComponent } from '@vote/api'

createEditorInjection(() => {
  let vm
  injectComponent(branchQuestionEditor).then(c => vm = c)
  addQuestionMenuEntry({
    icon: 'signal_wifi_off',
    label: 'plugin.branch-question.questionMenu.branch-question',
    handler: q => {
      vm.deleteOpen = true
      console.log(q.options)
      vm.questionEditing = q
    },
  })
})
