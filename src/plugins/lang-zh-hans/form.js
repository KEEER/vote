window.addEventListener('vote:ready', () => {
  // TODO: allow opt-out language detection
  if (navigator.language.slice(0, 2).toLowerCase() !== 'zh') return
  const hooks = window.voteHooks
  hooks.on('form:mounted', ([ form ]) => {
    form.texts = {
      ...form.texts,
      prevPage: '← 前一页',
      nextPage: '下一页 →',
      submit: '提交！',
      page: form => `第 ${form.currentPage} 页`,
      pageno: `第 ${form.currentPage} 页`,
      submitting: '正在提交……',
      submitted: '表单已经提交，感谢您的参与。',
      submiterror: '在提交表单时出错！',
    }
  })
})
