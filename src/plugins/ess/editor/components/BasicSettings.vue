<template>
  <div>
    <SettingsEntry
      ref="title"
      name="basic.title"
      preset="text-field"
      placeholder="plugin.ess.settings.titlePlaceholder"
      required
      :data="data"
      @update:saveState="updateSaveState"
      @update:value="updateTitle"
      @check="([ val, cancel ]) => !val ? cancel() : null"
    />
    <SettingsEntry
      ref="retrieving"
      name="basic.retrieving"
      preset="switch"
      label="plugin.ess.settings.retrievingLabel"
      :data="data"
      :value.sync="retrieving"
      @update:saveState="updateSaveState"
    />
    <p v-show="retrieving">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <m-typo-body :level="1" v-html="$t('plugin.ess.settings.shortLink', { link })" />
      <m-button @click="copyLink">
        <m-icon v-if="copyOk" slot="icon" icon="done" />
        {{ $t('plugin.ess.settings.clickToCopy') }}
      </m-button>
      <input ref="linkInput" :value="link">
    </p>
    <SettingsEntry
      ref="tags"
      name="tags.enabled"
      preset="switch"
      label="plugin.ess.settings.enableTagsLabel"
      :data="data"
      @update:saveState="updateSaveState"
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
  components: {
    SettingsEntry,
  },
  mixins: [ saveStateRelay ],
  props: {
    data: Object,
  },
  data () {
    return {
      link: window.KVoteFormData.shortLink,
      retrieving: this.data['basic.retrieving'],
      copyOk: false,
    }
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
}
</script>
