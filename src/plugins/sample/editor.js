import SampleEntry from './SampleEntry.vue'

window.addEventListener('vote:ready', () => {
  window.voteHooks
    .on('editor:appMounted', ([ app ]) => {
      app.documentTitle = 'Sample Vote'
      app.types.VSample = SampleEntry
      app.updateTitle()
    })
    .on('editor:beforeRouterLoad', ([ routes ]) => routes.push({
      path: '/:uname/:name/sample',
      name: 'sample',
      component: SampleEntry,
      icon: 'lock',
      title: 'plugin.sample.route.sample',
    }))
    .on('editor:settingsMounted', ([ { entries } ]) => entries
      .some(e => e.component.name === 'SampleEntry') ? null : entries.push({
        title: 'plugin.sample.settings.sample',
        component: SampleEntry,
      }))
    .on('editor:questionMounted', ([ vm ]) => {
      vm.menuItems.push({
        icon: 'signal_wifi_off',
        label: 'plugin.sample.questionMenu.sample',
        handler: vm => alert(vm.title_),
      })
    })
})
