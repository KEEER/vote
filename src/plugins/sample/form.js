import './styles.css'
import SampleEntry from './SampleEntry.vue'
import { createFormInjection, addQuestionType } from '@vote/api'
import { addValidationMixin } from './common'

createFormInjection(hooks => {
  addQuestionType('VSample', SampleEntry)
  addValidationMixin()
  hooks.on('question:update', ([ q, n ]) => {
    if (q.Question.type === 'VText') {
      if (/hello(,)? ?world/i.test(n)) {
        q.$nextTick(function () {
          q.value_ = n.replace(/hello(,)? ?world/gi, 'Hello, World')
        })
      }
    }
  })
})
