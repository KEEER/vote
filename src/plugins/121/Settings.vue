<template>
  <div>
    <SettingsEntry
      name="121"
      component="m-text-field"
      :id_="uid"
      textarea
      required
      :data="data"
      :value="JSON.stringify(data['121'] || {})"
      @update:saveState="updateSaveState"
    >
      <m-floating-label :for="uid">
        One to One 数据
      </m-floating-label>
    </SettingsEntry>
  </div>
</template>

<script>
import SettingsEntry from '@vote/plugins/ess/editor/components/SettingsEntry.vue'
import saveStateRelay from '@vote/plugins/ess/editor/components/saveStateRelay'

export default {
  components: { SettingsEntry },
  mixins: [ saveStateRelay ],
  props: {
    data: { type: Object, default: () => ({}) },
  },
}
</script>
