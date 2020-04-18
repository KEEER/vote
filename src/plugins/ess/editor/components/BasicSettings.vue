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
      :value.sync="retrieving"
    />
    <p v-show="retrieving">
      <m-typo-body :level="1" v-html="$t('plugin.ess.settings.shortLink', { link })" />
      <m-button @click="copyLink">
        <m-icon v-if="copyOk" icon="done" slot="icon" />
        {{ $t('plugin.ess.settings.clickToCopy') }}
      </m-button>
      <input :value="link" ref="linkInput" />
    </p>
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

<style scoped>
input {
  position: absolute;
  bottom: -100%;
  left: -100%;
}
p {
  margin: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}
</style>

<script>
import SettingsEntry from './SettingsEntry.vue'
import saveStateRelay from './saveStateRelay'

export default {
  name: 'BasicSettings',
  mixins: [ saveStateRelay ],
  data () {
    return {
      link: window.KVoteFormData.shortLink,
      retrieving: this.data['basic.retrieving'],
      copyOk: false,
    }
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
    copyLink () {
      this.$refs.linkInput.select()
      if (!document.execCommand('copy')) prompt(this.$t('plugin.ess.settings.manualCopy'), this.link)
      this.copyOk = true
    },
  },
  props: {
    data: Object,
  },
}
</script>
