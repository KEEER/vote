import { createEditorInjection, addQuestionType } from '@vote/api'
createEditorInjection(() => addQuestionType('VSmsVerify', { render: h => h('p', '这个问题类型无需配置。') }))
