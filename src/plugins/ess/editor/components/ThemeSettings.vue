<template>
  <div>
    <SettingsEntry
      v-for="entry in entries"
      :key="entry.name"
      ref="entry"
      :name="entry.name"
      :preset="entry.type"
      :value="typeof data[entry.name] === 'undefined' ? entry.default : data[entry.name]"
      :label="entry.label"
      :placeholder="entry.placeholder"
      :required="!!entry.required"
      :data="data"
      @update:saveState="updateSaveState"
    />
  </div>
</template>

<style>
.form-title {
  width: 100%;
}
</style>

<script>
import hooks from '../hooks'
import SettingsEntry from './SettingsEntry.vue'
import saveStateRelay from './saveStateRelay'

export default {
  name: 'ThemeSettings',
  components: { SettingsEntry },
  mixins: [ saveStateRelay ],
  props: {
    data: Object,
  },
  computed: {
    entries () {
      const cfg = window.KVoteFormData.themeConfig
      const entries = cfg.provides.formConfig
      /**
       * Preprocess theme form config entries event, inject theme form config here.
       * @event editor:ThemeSettings#editor:preprocessThemeFormConfigEntries
       * @type {object}
       * @property {editor:ThemeConfigEntries} vm the Vue instance
       * @property {object[]} form config entries
       */
      hooks.emit('editor:preprocessThemeFormConfigEntries', { vm: this, entries })
      return entries
    },
  },
  mounted () {},
  methods: {
    async update () {
      return await Promise.all(this.$refs.entry.map(e => e.update()))
    },
  },
}
</script>
