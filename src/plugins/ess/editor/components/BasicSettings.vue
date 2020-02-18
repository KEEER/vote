<template>
  <div>
    <SettingsEntry
      name="basic.title"
      preset="textField"
      :placeholder="$t('plugin.ess.settings.titlePlaceholder')"
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
      :label="$t('plugin.ess.settings.retrievingLabel')"
      @update:saveState="updateSaveState"
      :data="data"
      ref="retrieving"
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
      await this.$refs.title.update()
      await this.$refs.u.update()
    },
  },
  props: {
    data: Object,
  },
}
</script>
