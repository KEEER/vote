<template>
  <main class="settings">
    <ul class="settings-entries">
      <li
        class="settings-entry"
        v-for="(entry, i) in entries"
        :key="i"
      >
        <m-card class="settings-card">
          <m-typo-headline :level="3" class="entry-title">{{entry.name}}</m-typo-headline>
          <component :is="entry.component" :texts="texts" />
        </m-card>
      </li>
    </ul>
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
  data () {
    return {
      entries,
      texts: {
        titlePlaceholder: 'Title',
      },
    }
  },
  mounted () {
    hooks.emit('editor:settingsMounted', [ this ])
  },
}
</script>
