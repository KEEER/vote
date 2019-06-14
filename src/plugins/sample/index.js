import './styles.css'

window.addEventListener('vote:ready', () => {
  const hooks = window.voteHooks
  hooks.on('form:texts', ([_, set]) => {
    set({
      'submit': 'Go!',
    })
  })
  hooks.on('question:update', ([q, n]) => {
    if(q.question.type === 'VText') {
      if(/hello(,)? ?world/i.test(n)) {
        q.$nextTick(function() {
          q.value_ = n.replace(/hello(,)? ?world/gi, 'Hello, World')
        })
      }
    }
  })
})
