import BranchQuestionEditor from './BranchQuestionEditor.vue'
import { addQuestionMenuEntry, createEditorInjection, injectComponent } from '@vote/api'

createEditorInjection(() => {
  let vm
  injectComponent(BranchQuestionEditor).then(c => vm = c)
  addQuestionMenuEntry({
    icon: 'account_tree',
    label: '分支设置',
    handler: q => {
      vm.open = true
      vm.questionEditing = q
    },
  })
})
