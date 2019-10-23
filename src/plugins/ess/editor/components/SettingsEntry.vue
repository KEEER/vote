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
export default {
  name: 'SettingsEntry',
  data() {
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
    }
  },
  props: {
    name: String,
    value: {},
    component: {},
    preset: {},
  },
  watch: {
    value(val) {
      this.value_ = val
    },
    value_(val, old) {
      let cancel = false
      this.$emit('check', [val, () => cancel = true])
      if(cancel) {
        this.value_ = old
      }
      this.$emit('update:value', val)
      this.update()
    },
  },
  methods: {
    update() {
      // TODO
      console.log(this.value_)
    },
  },
  mounted() {
    if(!this.value) {
      // TODO: fetch value
      console.log(this.name)
      this.value_ = 'Something'
    }
  },
  computed: {
    bindings() {
      const d = {...this.$attrs}
      d.id = d.id_
      d.class = d.class_
      return d
    },
    presetComponent() {
      return this.presets[this.preset].component
    },
    presetBindings() {
      return this.presets[this.preset].bindings
    },
    presetSlotComponent() {
      return this.presets[this.preset].slotComponent
    },
    presetSlotBindings() {
      return this.presets[this.preset].slotBindings
    },
    presetSlotText() {
      return this.presets[this.preset].slotText
    },
  },
}
</script>
