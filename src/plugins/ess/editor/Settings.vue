<template>
  <main class="settings">
    <div v-if="exitSaveError">{{$t('plugin.ess.settings.exitSaveError')}}</div>
    <div v-else-if="exiting">{{$t('plugin.ess.settings.exiting')}}</div>
    <ul class="settings-entries" v-else-if="settingsLoaded">
      <m-tab-bar @activated="activeTab = $event.index">
        <m-tab-scroller>
          <m-tab :active="activeTab === i" v-for="(entry, i) in entries" :key="i">{{$t(entry.title)}}</m-tab>
        </m-tab-scroller>
      </m-tab-bar>
      <li
        class="settings-entry"
        v-for="(entry, i) in entries"
        :key="i"
        v-show="activeTab === i"
      >
        <component
          :ref="`entry-${i}`"
          :is="entry.component"
          @update:saveState="updateSaveState"
          :data="settingsData"
        />
      </li>
    </ul>
    <div v-else-if="settingsLoadError">{{$t('plugin.ess.settings.settingsLoadError')}}</div>
    <div v-else>{{$t('plugin.ess.settings.settingsLoading')}}</div>
  </main>
</template>

<style scoped>
.settings {
  padding: 16px;
  padding-top: 0;
}
.settings-entries {
  list-style: none;
  margin: 0;
  padding: 0;
}
.settings-entry {
  margin-top: 16px;
}
.entry-title {
  font-weight: 200;
  margin-bottom: 16px;
}
</style>

<script>
import BasicSettings from './components/BasicSettings.vue'
import ThemeSettings from './components/ThemeSettings.vue'
import DangerousSettings from './components/DangerousSettings.vue'
import hooks from './hooks'
import saveStateRelay from './components/saveStateRelay'
import saveStateDisplay from './components/saveStateDisplay'
import { query } from '../common/graphql'

const entries = [
  {
    title: 'plugin.ess.settings.entry.basic',
    component: BasicSettings,
  },
  {
    title: 'plugin.ess.settings.entry.theme',
    component: ThemeSettings,
  },
  {
    title: 'plugin.ess.settings.entry.dangerous',
    component: DangerousSettings,
  },
]

export default {
  name: 'Settings',
  mixins: [ saveStateRelay, saveStateDisplay ],
  data () {
    return {
      entries,
      settingsData: null,
      settingsLoaded: false,
      settingsLoadError: false,
      activeTab: 0,
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
