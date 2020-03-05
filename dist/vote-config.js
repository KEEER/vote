window.KVoteFormData = {
  title: 'TestTitle',
  action: '/',
  method: 'POST',
  config: {
    settings: {
      'theme-default.secondary-color': 'red',
      'theme-default.theme-color': 'blue',
      'theme-default.bg-color': '#f5fafd',
      'theme-default.text-color': '#002d4d',
    },
  },
  data: [
    [
      {
        id: 1,
        type: 'VRadio',
        title: '1. Select one',
        value: '2',
        required: true,
        description: { html: '<b>Hello</b> world.' },
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
        required: true,
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

for (var i of Array(10).keys()) KVoteFormData.data[0].push({
  id: i + 5,
  type: 'VTextarea',
  title: 'Input',
  value: '2',
})

window.addEventListener('vote:ready', function () {
  var hooks = window.voteHooks
  hooks.on('form:texts', function ([ , set ]) {
    set({
      prevPage: '上一页',
      submit: '提交',
    })
  })
  hooks.on('form:texts', function ([ form, set ]) {
    set({
      submit: '提交!',
      pageno: '页码' + (form.currentPage + 1) + (form.current % 2 == 0 ? '，奇数页' : '，偶数页'),
    })
  })
  hooks.on('form:pageno', function ([ form, set ]) {
    set(form.current + 0.1415926)
  })
  hooks.on('form:submitted', function () {
    alert('submitted')
  })
  hooks.on('form:submitting', function () {
    console.log('submitting')
  })
  hooks.on('question:update', function ([ q, , o ]) {
    if (q.question.type === 'VCheckbox') {
      var count = 0
      for (var i in q.question.value) {
        if (q.question.value[i]) count++
      }
      if (count > 2) {
        q.$nextTick(function () {
          q.value_ = o
          q.$nextTick(function () {
            q.question.data.title = '2. Do not select more than 2!'
          })
        })
      } else {
        q.question.data.title = '2. Select at most 2'
      }
    }
  })
  hooks.on('form:beforesubmit', function ([ form, cancel ]) {
    if (form.pages[1].questions[0].value === '2') {
      form.pages[1].questions[0].data.title = '3. Please type something other than 2.'
      cancel()
    }
  })
  console.log('vote:ready')
})
