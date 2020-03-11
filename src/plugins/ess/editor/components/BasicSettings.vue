<template>
  <div>
    <SettingsEntry
      name="basic.title"
      preset="text-field"
      placeholder="plugin.ess.settings.titlePlaceholder"
      required
      @update:saveState="updateSaveState"
      :data="data"
      @update:value="updateTitle"
      @check="([ val, cancel ]) => !val ? cancel() : null"
      ref="title"
    />
    <SettingsEntry
      name="basic.retrieving"
      preset="switch"
      label="plugin.ess.settings.retrievingLabel"
      @update:saveState="updateSaveState"
      :data="data"
      ref="retrieving"
    />
    <SettingsEntry
      name="tags.enabled"
      preset="switch"
      label="plugin.ess.settings.enableTagsLabel"
      @update:saveState="updateSaveState"
      :data="data"
      ref="tags"
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

export default {
  name: 'BasicSettings',
  mixins: [ saveStateRelay ],
  data () {
    return {}
  },
  components: {
    SettingsEntry,
  },
  methods: {
    updateTitle (title) {
      const app = this.$root.$children[0]
      app.title = title
      app.updateTitle()
    },
    async update () {
      await Promise.all([
        this.$refs.title.update(),
        this.$refs.retrieving.update(),
        this.$refs.tags.update(),
      ])
    },
  },
  props: {
    data: Object,
  },
}
</script>
