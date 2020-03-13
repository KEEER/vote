<template>
  <span class="settings-entry">
    <component v-if="component" :is="component" v-model="value_" v-bind="bindings">
      <slot />
    </component>
    <template v-else-if="preset">
      <m-text-field v-if="preset === 'text-field'" v-model="value_" class="settings-fullwidth" :id="uid" outlined :required="'required' in $attrs">
        <m-floating-label :for="uid">{{$t($attrs.placeholder)}}</m-floating-label>
      </m-text-field>
      <div v-if="preset === 'checkbox'" class="labelled">
        <m-checkbox v-model="value_" :id="uid" />
        <label :for="uid">{{$t($attrs.label)}}</label>
      </div>
      <div v-if="preset === 'switch'" class="labelled">
        <m-switch class="switch" v-model="value_" :id="uid" />
        <label :for="uid">{{$t($attrs.label)}}</label>
      </div>
      <div v-if="preset === 'color'">
        <m-typo-headline :level="6" class="color-label">{{$t($attrs.label)}}</m-typo-headline>
        <color-picker v-model="value_" />
      </div>
    </template>
    <slot v-else :value.sync="value_" />
  </span>
</template>

<style>
.settings-fullwidth { width: 100%; }
</style>

<style scoped>
.settings-entry { margin-top: 8px; }
.labelled {
  display: flex;
  align-items: center;
}
.switch { margin: 16px 12px 16px 8px; }
.color-label {
  display: block;
  margin: 16px 0 8px;
}
</style>

<script>
import updateObservable from './updateObservable'
import { updateSetting } from './util'

export default {
  name: 'SettingsEntry',
  mixins: [
    updateObservable(vm => updateSetting(vm.name, vm.value_)),
  ],
  data () {
    return {
      value_: typeof this.value === 'undefined' ? this.data[this.name] : this.value,
      class: {},
      id: null,
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
      /**
       * Check if the settings entry value is valid event.
       * @event editor:SettingsEntry#check
       * @type {object}
       * @property {any} value the value of the entry
       * @property {function} cancel call to invalidate
       */
      this.$emit('check', { value: val, cancel: () => cancel = true })
      if (cancel) {
        this.value_ = old
      }
      this.$emit('update:value', val)
      this.logChange()
    },
  },
  computed: {
    bindings () {
      const d = { ...this.$attrs }
      d.id = d.id_
      d.class = d.class_
      return d
    },
  },
}
</script>
