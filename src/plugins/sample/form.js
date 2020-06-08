import './styles.css'
import SampleEntry from './SampleEntry.vue'
import { addValidationMixin } from './common'
import { createFormInjection, addQuestionType } from '@vote/api'

createFormInjection(hooks => {
  addQuestionType('VSample', SampleEntry)
  addValidationMixin()
  hooks.on('question:update', ({ question, value }) => {
    if (question.Question.type === 'VText') {
      if (/hello(,)? ?world/i.test(value)) {
        question.$nextTick(function () {
          question.value_ = value.replace(/hello(,)? ?world/gi, 'Hello, World')
        })
      }
    }
  })
})
