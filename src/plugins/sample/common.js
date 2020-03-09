import { addEditorRoute } from '@vote/api'
const SampleEntry = typeof window !== 'undefined' ? require('./SampleEntry.vue').default : null

export const editorRouteMixin = addEditorRoute({
  name: 'sample',
  component: SampleEntry,
  icon: 'lock',
  title: 'plugin.sample.route.sample',
})
