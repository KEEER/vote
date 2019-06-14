window.KVoteFormData = {
  title: 'TestTitle',
  action: '/',
  method: 'POST',
  data: [
    [
      {
        id: 1,
        type: 'VRadio',
        title: '1. Select one',
        value: '2',
        options: [
          {
            label: 'One',
            value: '1',
          },
          {
            label: 'Two',
            value: '2',
          },
          {
            label: 'Three',
            value: '3',
          },
        ],
      },
      {
        id: 2,
        type: 'VCheckbox',
        title: '2. Select at most 2',
        value: {
          '1': true,
        },
        options: [
          {
            label: 'One',
            value: '1',
          },
          {
            label: 'Two',
            value: '2',
          },
          {
            label: 'Three',
            value: '3',
          },
        ],
      },
    ],
    [
      {
        id: 3,
        type: 'VText',
        title: '3. Input (Try typing in \'hello world\' in any format)',
        value: '2',
      },
      {
        id: 4,
        type: 'VTextarea',
        title: '4. Input',
        value: '2',
      },
    ],
  ],
}

window.addEventListener('vote:ready', function() {
  var hooks = window.voteHooks
  hooks.on('form:texts', function([_, set]) {
    set({
      prevPage: '上一页',
      submit: '提交',
    })
  }).on('form:texts', function([form, set]) {
    set({
      submit: '提交!',
      pageno: '页码' + (form.currentPage + 1) + (form.current % 2 == 0 ? '，奇数页' : '，偶数页'),
    })
  }).on('form:pageno', function([form, set]) {
    set(form.current + 0.1415926)
  }).on('form:submitted', function() {
    alert('submitted')
  }).on('form:submitting', function() {
    console.log('submitting')
  }).on('question:update', function([q, _, o]) {
    if(q.question.type === 'VCheckbox') {
      var count = 0
      for(var i in q.question.value) {
        if(q.question.value[i]) count++
      }
      if(count > 2) {
        q.$nextTick(function() {
          q.value_ = o
          q.$nextTick(function() {
            q.question.data.title = '2. Do not select more than 2!'
          })
        })
      } else {
        q.question.data.title = '2. Select at most 2'
      }
    }
  }).on('form:beforesubmit', function([form, cancel]) {
    if(form.pages[1].questions[0].value === '2') {
      form.pages[1].questions[0].data.title = '3. Please type something other than 2.'
      cancel()
    }
  }).on('form:submit', function([form]) {
    const payload = JSON.stringify(form.formdata)
    if(form.method !== 'POST') throw new Error('Only POST is supported by now')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', form.action)
    xhr.onreadystatechange = function() {
      if(this.readyState !== 4) return
      if(this.status !== 200) {
        form.status = 'submiterror'
        hooks.emit('form:submiterror', [form, this])
      } else {
        form.status = 'submitted'
        hooks.emit('form:submitted', [form])
      }
    }
    try {
      xhr.send(payload)
      form.status = 'submitting'
    } catch(e) {
      console.error(e)
      hooks.emit('form:error', [e])
    }
  })
  console.log('vote:ready')
})
