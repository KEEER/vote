<template>
  <span>
    <component v-if="component" :is="component" v-model="value_" v-bind="bindings">
      <slot />
    </component>
    <component v-else-if="preset" v-model="value_" :is="presetComponent" v-bind="presetBindings">
      <component v-if="presetSlotComponent" :is="presetSlotComponent" v-bind="presetSlotBindings">
        {{presetSlotText}}
      </component>
    </component>
    <slot v-else :value.sync="value_" />
  </span>
</template>

<style>
.settings-fullwidth {
  width: 100%;
}
</style>

<script>
import { query } from '../../common/graphql'

export default {
  name: 'SettingsEntry',
  data () {
    return {
      value_: this.value,
      class: {},
      id: null,
      presets: {
        textField: {
          component: 'm-text-field',
          bindings: {
            class: 'settings-fullwidth',
            id: this.uid,
            outlined: true,
            required: 'required' in this.$attrs,
          },
          slotComponent: 'm-floating-label',
          slotBindings: {
            for: this.uid,
          },
          slotText: this.$attrs.placeholder,
        },
      },
      loaded: false,
    }
  },
  props: {
    name: String,
    value: {},
    component: {},
    preset: {},
  },
  watch: {
    value (val) {
      this.value_ = val
    },
    value_ (val, old) {
      if (!this.loaded) return
      let cancel = false
      this.$emit('check', [ val, () => cancel = true ])
      if (cancel) {
        this.value_ = old
      }
      this.$emit('update:value', val)
      // TODO: update occasion
      this.update()
    },
  },
  methods: {
    async update () {
      // TODO
      try {
        const res = await query(`
          mutation UpdateSettings($name: String!, $value: String) {
            updateSettings(name: $name, value: $value)
          }`.trim(), {
          name: this.name,
          value: this.value_,
        })
        if (res.errors || !res.data.updateSettings) throw res
      } catch (e) {
        // TODO
        alert('Error updating settings')
        console.log('update error', e)
        return
      }
    },
  },
  mounted () {
    if (!this.value) {
      // TODO: fetch value
      console.log(this.name)
      this.value_ = 'Something'
      this.$nextTick(() => this.loaded = true)
    }
  },
  computed: {
    bindings () {
      const d = { ...this.$attrs }
      d.id = d.id_
      d.class = d.class_
      return d
    },
    presetComponent () {
      return this.presets[this.preset].component
    },
    presetBindings () {
      return this.presets[this.preset].bindings
    },
    presetSlotComponent () {
      return this.presets[this.preset].slotComponent
    },
    presetSlotBindings () {
      return this.presets[this.preset].slotBindings
    },
    presetSlotText () {
      return this.presets[this.preset].slotText
    },
  },
}
</script>
