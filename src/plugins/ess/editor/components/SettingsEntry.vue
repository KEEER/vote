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
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'
import updateObservable from './updateObservable'

Vue.use(MTextField)
Vue.use(MFloatingLabel)

export default {
  name: 'SettingsEntry',
  mixins: [ updateObservable ],
  data () {
    return {
      value_: typeof this.value === 'undefined' ? this.data[this.name] : this.value,
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
    }
  },
  props: {
    name: String,
    value: {},
    component: {},
    preset: {},
    data: {},
  },
  watch: {
    value (val) {
      this.value_ = val
    },
    value_ (val, old) {
      let cancel = false
      this.$emit('check', [ val, () => cancel = true ])
      if (cancel) {
        this.value_ = old
      }
      this.$emit('update:value', val)
      this.logChange()
    },
  },
  methods: {
    async update () {
      if (!this.changed) return
      this.changed = false
      this.saveState = 'saving'
      this.lastUpdated = Date.now()
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
      if (!this.changed) this.saveState = 'saved'
    },
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
