<template>
  <div>
    <m-list two-line role="group">
      <m-list-item role="checkbox" v-for="plugin in allPlugins" :key="plugin.code">
        <template slot="primaryText">{{ $t(`plugin.${plugin.code}.name`) }}</template>
        <template slot="secondaryText">{{ $t(`plugin.${plugin.code}.description`) }}</template>
        <m-checkbox slot="meta" :checked="selectedPlugins.indexOf(plugin.code) > -1" v-on="{ change: onChange(plugin.code) }" :disabled="plugin.required" />
      </m-list-item>
    </m-list>
  </div>
</template>

<script>
import updateObservable from './updateObservable'
import hooks from '../hooks'
import { updateSetting } from './util'

export default {
  name: 'PluginSettings',
  data () {
    return {
      allPlugins: null,
      selectedPlugins: null,
    }
  },
  mixins: [
    updateObservable(async vm => updateSetting('basic.plugins', JSON.stringify(vm.selectedPlugins))),
  ],
  methods: {
    onChange (code) {
      return () => {
        const i = this.selectedPlugins.indexOf(code)
        if (i < 0) this.selectedPlugins.push(code)
        else this.selectedPlugins.splice(i, 1)
        this.logChange()
      }
    },
    update () {},
  },
  props: {
    data: Object,
  },
  mounted () {
    this.allPlugins = JSON.parse(this.data['basic._all-plugins'])
    this.selectedPlugins = JSON.parse(this.data['basic.plugins'])
    hooks.emit('editor:pluginMounted', [ this ])
  },
}
</script>
