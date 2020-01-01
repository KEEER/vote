<template>
  <main class="settings">
    <div v-if="exitSaveError">{{texts.exitSaveError}}</div>
    <div v-else-if="exiting">{{texts.exiting}}</div>
    <ul class="settings-entries" v-else-if="settingsLoaded">
      <li
        class="settings-entry"
        v-for="(entry, i) in entries"
        :key="i"
      >
        <m-card class="settings-card">
          <m-typo-headline :level="3" class="entry-title">{{entry.name}}</m-typo-headline>
          <component
            :ref="`entry-${i}`"
            :is="entry.component"
            :texts="texts"
            @update:saveState="updateSaveState"
            :data="settingsData"
          />
        </m-card>
      </li>
    </ul>
    <div v-else-if="settingsLoadError">{{texts.settingsLoadError}}</div>
    <div v-else>{{texts.settingsLoading}}</div>
  </main>
</template>

<style lang="scss">
@import './styles';
@import 'material-components-vue/dist/card/styles';
@import 'material-components-vue/dist/typography/styles';
</style>

<style scoped>
.settings-entries {
  list-style: none;
  padding: 0;
}

.settings-card {
  margin: 16px;
  padding: 16px;
}

.entry-title {
  font-weight: 200;
  margin-bottom: 16px;
}
</style>

<script>
import MCard from 'material-components-vue/dist/card/card.min.js'
import MTypo from 'material-components-vue/dist/typography/typography.min.js'

import BasicSettings from './components/BasicSettings.vue'
import PluginSettings from './components/PluginSettings.vue'
import hooks from './hooks'
import saveStateRelay from './components/saveStateRelay'
import saveStateDisplay from './components/saveStateDisplay'
import { query } from '../common/graphql'

Vue.use(MCard)
Vue.use(MTypo)

const entries = [
  {
    name: 'Basics',
    component: BasicSettings,
  },
  {
    name: 'Plugins',
    component: PluginSettings,
  },
]

export default {
  name: 'Settings',
  mixins: [ saveStateRelay, saveStateDisplay ],
  data () {
    return {
      entries,
      texts: {
        titlePlaceholder: 'Title',
        settingsLoadError: 'Load Error',
        settingsLoading: 'Loading Settings...',
        exiting: 'Saving settings, please wait...',
        exitSaveError: 'Error saving settings, data may be not saved. Please refresh to continue.',
      },
      settingsData: null,
      settingsLoaded: false,
      settingsLoadError: false,
    }
  },
  methods: {
    async loadSettings () {
      try {
        const res = await query('{ form { data } }', {})
        if (res.errors) throw res
        this.settingsData = (JSON.parse(res.data.form.data) || {}).settings || {}
        this.settingsLoaded = true
      } catch (e) {
        console.error(e)
        this.settingsLoadError = true
      }
    },
    async update () {
      return await Promise.all(this.entries.map((_, i) => this.$refs[`entry-${i}`][0].update()))
    },
  },
  mounted () {
    hooks.emit('editor:settingsMounted', [ this ])
    this.loadSettings()
  },
}
</script>
