import './styles.css'
import SampleEntry from './SampleEntry.vue'

window.addEventListener('vote:ready', () => {
  const hooks = window.voteHooks
  hooks.on('question:update', ([ q, n ]) => {
    if (q.question.type === 'VText') {
      if (/hello(,)? ?world/i.test(n)) {
        q.$nextTick(function () {
          q.value_ = n.replace(/hello(,)? ?world/gi, 'Hello, World')
        })
      }
    }
  })
  hooks.on('form:mounted', ([ vm ]) => vm.$set(vm.types, 'VSample', SampleEntry))
})
