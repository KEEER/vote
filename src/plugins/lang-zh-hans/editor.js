window.addEventListener('vote:ready', () => {
  const questionTexts = {
    title: '问题标题',
    description: '问题描述(可选)',
    required: '必填',
    type: '问题类型',
    valuePlaceholder: '默认回答',
    noValuePlaceholder: '没有回答',
    labelPlaceholder: '描述',
    nulltype: '请声明一种问题类型。',
    default: {
      type: 'VText',
      title: '新的问题',
    },
    remove: '删除问题',
    theme: '主题设置',
  }
  const saveHint = {
    notChanged: '自动保存已开启',
    awaitInputStop: '正在等待您停止编辑……',
    saving: '正在保存……',
    saved: '已保存到云端',
  }
  const hooks = window.voteHooks
  hooks.on('editor:beforeRouterLoad', ([ routes ]) => {
    const mapping = {
      fill: '填写',
      edit: '编辑器',
      data: '数据',
      settings: '设置',
    }
    for (let route of routes) {
      if (route.name in mapping) route.title = mapping[route.name]
    }
  })
  hooks.on('editor:typeSelectorMounted', ([ vm ]) => {
    vm.questionTypes.VText = '单行填空'
    vm.questionTypes.VTextarea = '多行填空'
    vm.questionTypes.VCheckbox = '多选'
    vm.questionTypes.VRadio = '单选'
  })
  hooks.on('editor:editorMounted', ([ vm ]) => {
    vm.texts = {
      ...vm.texts,
      saveHint,
      new: '添加问题',
      cancel: '取消',
      ok: '确定',
      questionLoadError: '问题加载错误',
      questionLoading: '正在加载问题……',
      exiting: '正在保存问题，请稍候……',
      exitSaveError: '保存问题过程中出错，数据可能没有保存。请刷新以继续。',
      updateError: '更新问题过程中出错。',
      removeError: '删除问题过程中出错。',
      question: { ...vm.texts.question, ...questionTexts },
    }
  })
  hooks.on('editor:dataMounted', ([ vm ]) => {
    vm.texts = {
      ...vm.texts,
      loading: '正在加载数据中……',
      loadError: '加载数据失败',
      submissionCount: '份提交',
      submissionId: '提交ID: ',
      submissionTime: '提交时间: ',
      noSubmissions: '没有提交。',
      question: { ...vm.texts.question, ...questionTexts },
    }
  })
  hooks.on('editor:settingsMounted', ([ vm ]) => {
    vm.texts = {
      ...vm.texts,
      saveHint,
      titlePlaceholder: '问卷标题',
      settingsLoadError: '加载失败',
      settingsLoading: '正在加载设置……',
      exiting: '正在保存设置，请稍候……',
      exitSaveError: '保存数据过程中出错，数据可能没有保存。请刷新以继续。',
    }
  })
})
