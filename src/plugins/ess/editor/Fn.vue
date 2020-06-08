<template>
  <main>
    <m-typo-headline class="block" :level="5" v-text="$t('plugin.ess.fn.plugins')" />
    <m-typo-body class="block typo-body" :level="1" v-text="$t('plugin.ess.fn.pluginIntroduction')" />
    <m-list two-line role="group">
      <m-list-item v-for="plugin in allPlugins" :key="plugin.code" role="checkbox" :aria-checked="isSelected(plugin)">
        <template slot="primaryText" v-text="$t(`plugin.${plugin.code}.name`)" />
        <template slot="secondaryText" v-text="$t(`plugin.${plugin.code}.description`)" />
        <m-checkbox slot="meta" :checked="isSelected(plugin)" :disabled="plugin.required" v-on="{ change: onChange(plugin.code) }" />
      </m-list-item>
    </m-list>
    <hr>
    <m-typo-headline class="block" :level="5" v-text="$t('plugin.ess.fn.theme')" />
    <m-typo-body class="block typo-body" :level="1" v-text="$t('plugin.ess.fn.themeIntroduction')" />
    <m-list v-model="themeId" two-line role="radiogroup">
      <m-list-item v-for="(thisTheme, i) in allThemes" :key="thisTheme.code" role="radio">
        <m-radio slot="meta" :checked="themeId === i" name="theme" :value="i" />
        <template slot="primaryText" v-text="$t(`theme.${thisTheme.code}.name`)" />
        <template slot="secondaryText" v-text="$t(`theme.${thisTheme.code}.description`)" />
      </m-list-item>
    </m-list>
    <m-button class="submit-button" :disabled="submitting" unelevated @click="submit" v-text="$t('plugin.ess.fn.submit')" />
  </main>
</template>

<style scoped>
main { padding: 16px; }
hr {
  height: 0;
  color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  width: 100%;
  margin-bottom: 16px;
}
.block {
  display: block;
  margin: 0 12px;
}
.typo-body {
  opacity: .78;
  margin-top: 8px;
}
.submit-button {
  float: right;
  margin-right: 16px;
}
</style>

<script>
import { query } from '../common/graphql'
import hooks from './hooks'

export default {
  name: 'Fn',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      submitting: false,
      allPlugins: window.KVoteFormData.allPlugins,
      selectedPlugins: window.KVoteFormData.plugins,
      allThemes: window.KVoteFormData.allThemes,
      themeId: window.KVoteFormData.allThemes.findIndex(t => t.code === window.KVoteFormData.theme),
    }
  },
  mounted () {
    /**
     * Fn component mounted event.
     * @event editor.editor:fnMounted
     * @type {editor:Fn}
     */
    hooks.emit('editor:fnMounted', this)
  },
  methods: {
    onChange (code) {
      return state => {
        const i = this.selectedPlugins.indexOf(code)
        if (i < 0 && state) this.selectedPlugins.push(code)
        if (i > -1 && !state) this.selectedPlugins.splice(i, 1)
      }
    },
    async submit () {
      this.submitting = true
      try {
        const res = await query(`mutation updateFn ($plugins: String!, $theme: String!) {
          updateFn(plugins: $plugins, theme: $theme)
        }`, { plugins: JSON.stringify(this.selectedPlugins), theme: this.allThemes[this.themeId].code })
        if (res.errors || !res.data.updateFn) throw res
      } catch (e) {
        alert(this.$t('plugin.ess.fn.failed'))
        console.error('update fn', e)
      }
      location.reload()
    },
    isSelected (plugin) { return this.selectedPlugins.includes(plugin.code) },
  },
}
</script>
