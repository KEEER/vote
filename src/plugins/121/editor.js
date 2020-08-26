import Settings from './Settings.vue'
import { createEditorInjection, addSettingsEntry } from '@vote/api'

createEditorInjection(() => addSettingsEntry({ name: '121', component: Settings, title: 'One to one' }))
