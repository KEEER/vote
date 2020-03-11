import { addEditorRoute } from '@vote/api'
import SampleEntry from './SampleEntry.vue'

export const editorRouteMixin = addEditorRoute({
  name: 'sample',
  component: SampleEntry,
  icon: 'lock',
  title: 'plugin.sample.route.sample',
})
