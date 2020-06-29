<template>
  <main class="settings">
    <div v-if="exitSaveError" v-text="$t('plugin.ess.settings.exitSaveError')" />
    <div v-else-if="exiting" v-text="$t('plugin.ess.settings.exiting')" />
    <ul v-else-if="settingsLoaded" class="settings-entries">
      <m-tab-bar @activated="activeTab = $event.index">
        <m-tab-scroller>
          <m-tab v-for="(entry, i) in entries" :key="i" :active="activeTab === i">
            {{ $t(entry.title) }}
          </m-tab>
        </m-tab-scroller>
      </m-tab-bar>
      <li
        v-for="(entry, i) in entries"
        v-show="activeTab === i"
        :key="i"
        class="settings-entry"
      >
        <component
          :is="entry.component"
          :ref="`entry-${i}`"
          :data="settingsData"
          @update:saveState="updateSaveState"
        />
      </li>
    </ul>
    <div v-else-if="settingsLoadError" v-text="$t('plugin.ess.settings.settingsLoadError')" />
    <div v-else v-text="$t('plugin.ess.settings.settingsLoading')" />
    <slot />
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
import settingsNeeded from './settingsNeeded'

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
  mixins: [ saveStateRelay, saveStateDisplay, settingsNeeded ],
  data () {
    return {
      entries,
      activeTab: 0,
    }
  },
  mounted () {
    /**
     * Settings component mounted event.
     * @event editor.editor:editorMounted
     * @type {editor:Settings}
     */
    hooks.emit('editor:settingsMounted', this)
    this.loadSettings()
  },
  methods: {
    async update () {
      return await Promise.all(this.entries.map((_, i) => this.$refs[`entry-${i}`][0].update()))
    },
  },
}
</script>
