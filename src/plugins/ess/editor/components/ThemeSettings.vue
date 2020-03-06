<template>
  <div>
    <SettingsEntry
      v-for="entry in entries"
      :key="entry.name"
      :name="entry.name"
      :preset="entry.type"
      :value="typeof data[entry.name] === 'undefined' ? entry.default : data[entry.name]"
      :label="entry.label"
      :placeholder="entry.placeholder"
      :required="!!entry.required"
      @update:saveState="updateSaveState"
      :data="data"
      ref="entry"
    />
  </div>
</template>

<style>
.form-title {
  width: 100%;
}
</style>

<script>
import SettingsEntry from './SettingsEntry.vue'
import saveStateRelay from './saveStateRelay'
import hooks from '../hooks'

export default {
  name: 'ThemeSettings',
  mixins: [ saveStateRelay ],
  components: { SettingsEntry },
  computed: {
    entries () {
      const cfg = window.KVoteFormData.themeConfig
      const entries = cfg.provides.formConfig
      hooks.emit('editor:preprocessThemeFormConfigEntries', [ this, entries ])
      return entries
    },
  },
  methods: {
    async update () {
      return await Promise.all(this.$refs.entry.map(e => e.update()))
    },
  },
  props: {
    data: Object,
  },
  mounted () {},
}
</script>
