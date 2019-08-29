<template>
  <li class="checkbox-li">
    <m-icon-button @click="remove">
      <m-icon icon="remove" />
    </m-icon-button>
    <m-checkbox v-model="value_" :value="cbvalue" />
    <m-text-field outlined :id="uid" v-model="label_" class="label">
      <m-floating-label :for="uid">{{texts.question.labelPlaceholder}}</m-floating-label>
    </m-text-field>
    <m-icon icon="menu" class="handle" />
  </li>
</template>

<style lang="scss">
@import '../../styles.scss';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/checkbox/styles';
@import 'material-components-vue/dist/floating-label/styles';
</style>

<style scoped>
.checkbox-li {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 6px 0;
}

.label {
  flex: auto;
}

.handle {
  padding: 12px;
}
</style>

<script>
import MCheckbox from 'material-components-vue/dist/checkbox/checkbox.min.js'
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFormField from 'material-components-vue/dist/form-field/form-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'

Vue.use(MCheckbox)
Vue.use(MTextField)
Vue.use(MFormField)
Vue.use(MFloatingLabel)

export default {
  name: 'VCheckboxInput',
  data() {
    return {
      value_: this.value,
      label_: this.label,
    }
  },
  props: {
    label: String,
    value: Boolean,
    texts: Object,
    cbvalue: {},
  },
  methods: {
    remove() {
      this.$emit('remove')
    },
  },
  watch: {
    value_(val) {
      this.$emit('update:value', val)
    },
    value(val) {
      this.value_ = val
    },
    label_(val) {
      this.$emit('update:label', val)
    },
    label(val) {
      this.label_ = this.label
    },
  },
}
</script>
