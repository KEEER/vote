<template>
  <main>
    <m-typo-headline class="block" :level="5">{{$t('plugin.ess.fn.plugins')}}</m-typo-headline>
    <m-typo-body class="block typo-body" :level="1">{{$t('plugin.ess.fn.pluginIntroduction')}}</m-typo-body>
    <m-list two-line role="group">
      <m-list-item role="checkbox" v-for="plugin in allPlugins" :key="plugin.code">
        <template slot="primaryText">{{$t(`plugin.${plugin.code}.name`)}}</template>
        <template slot="secondaryText">{{$t(`plugin.${plugin.code}.description`)}}</template>
        <m-checkbox slot="meta" :checked="selectedPlugins.indexOf(plugin.code) > -1" v-on="{ change: onChange(plugin.code) }" :disabled="plugin.required" />
      </m-list-item>
    </m-list>
    <hr />
    <m-typo-headline class="block" :level="5">{{$t('plugin.ess.fn.theme')}}</m-typo-headline>
    <m-typo-body class="block typo-body" :level="1">{{$t('plugin.ess.fn.themeIntroduction')}}</m-typo-body>
    <m-list two-line role="radiogroup" v-model="themeId">
      <m-list-item role="radio" v-for="(thisTheme, i) in allThemes" :key="thisTheme.code">
        <m-radio :checked="themeId === i" name="theme" slot="meta" :value="i" />
        <template slot="primaryText">{{$t(`theme.${thisTheme.code}.name`)}}</template>
        <template slot="secondaryText">{{$t(`theme.${thisTheme.code}.description`)}}</template>
      </m-list-item>
    </m-list>
    <m-button class="submit-button" :disabled="submitting" unelevated @click="submit">{{$t('plugin.ess.fn.submit')}}</m-button>
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
import hooks from './hooks'
import { query } from '../common/graphql'

export default {
  name: 'Fn',
  data () {
    return {
      submitting: false,
      allPlugins: window.KVoteFormData.allPlugins,
      selectedPlugins: window.KVoteFormData.plugins,
      allThemes: window.KVoteFormData.allThemes,
      themeId: window.KVoteFormData.allThemes.findIndex(t => t.code === window.KVoteFormData.theme),
    }
  },
  methods: {
    onChange (code) {
      return () => {
        const i = this.selectedPlugins.indexOf(code)
        if (i < 0) this.selectedPlugins.push(code)
        else this.selectedPlugins.splice(i, 1)
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
  },
  props: {
    data: Object,
  },
  mounted () {
    /**
     * Fn component mounted event.
     * @event editor.editor:fnMounted
     * @type {editor:Fn}
     */
    hooks.emit('editor:fnMounted', this)
  },
}
</script>
