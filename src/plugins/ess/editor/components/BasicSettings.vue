<template>
  <div>
    <SettingsEntry name="basic.title" preset="textField" :placeholder="texts.titlePlaceholder" required></SettingsEntry>
  </div>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/floating-label/styles';
</style>

<style>
.form-title {
  width: 100%;
}
</style>

<script>
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'

import SettingsEntry from './SettingsEntry.vue'

Vue.use(MTextField)
Vue.use(MFloatingLabel)

export default {
  name: 'BasicSettings',
  data() {
    return {}
  },
  components: {
    SettingsEntry,
  },
  props: {
    texts: Object,
  },
}
</script>
