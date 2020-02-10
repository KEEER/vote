import SampleEntry from './SampleEntry.vue'

window.addEventListener('vote:ready', () => {
  window.voteHooks
    .on('editor:appMounted', ([ app ]) => app.documentTitle = 'Sample Vote')
    .on('editor:beforeRouterLoad', ([ routes ]) => routes.push({
      path: '/:uid/:id/sample',
      name: 'sample',
      component: SampleEntry,
      icon: 'lock',
    }))
    .on('editor:settingsMounted', ([ { entries } ]) => entries
      .some(e => e.component.name === 'SampleEntry') ? null : entries.push({
        name: 'Sample Plugin',
        component: SampleEntry,
      }))
})
