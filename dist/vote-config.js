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
        title: '3. Input',
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
  voteHooks.on('form:texts', function(form, set) {
    set({
      prevPage: '上一页',
      submit: '提交',
    })
  }).on('form:texts', function(form, set) {
    set({
      submit: '提交!',
      pageno: '页码' + (form.current - 1)
    })
  }).on('form:submitted', function() {
    alert('submitted')
  }).on('form:submitting', function() {
    console.log('submitting')
  }).on('question:update', function(q, n, o) {
    if(q.question.type === 'VCheckbox') {
      var count = 0
      for(var i in q.question.value) {
        if(q.question.value[i]) count++
      }
      if(count > 2) {
        q.$nextTick(function() {
          q.value = o
        })
      }
    }
  })
  console.log('vote:ready')
})
