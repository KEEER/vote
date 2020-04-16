<template>
  <li class="checkbox-li">
    <m-icon-button v-if="isEditor" @click="remove" icon="remove" />
    <m-checkbox :disabled="isData" v-model="value_" :value="cbvalue" />
    <m-text-field v-if="isEditor" outlined :id="uid" v-model="label_" class="label">
      <m-floating-label :for="uid">{{ $t('plugin.ess.question.labelPlaceholder') }}</m-floating-label>
    </m-text-field>
    <span v-else>{{ label_ }}</span>
    <m-icon v-if="isEditor" icon="drag_handle" class="handle" />
  </li>
</template>

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
  cursor: move;
}
</style>

<script>
export default {
  name: 'VCheckboxInput',
  data () {
    return {
      value_: this.value,
      label_: this.label,
    }
  },
  props: {
    label: String,
    value: Boolean,
    cbvalue: {},
    route: String,
  },
  computed: {
    isEditor () { return this.route === 'editor' },
    isData () { return this.route === 'data' },
  },
  methods: {
    remove () { this.$emit('remove') },
  },
  watch: {
    value_ (val) { this.$emit('update:value', val) },
    value (val) { this.value_ = val },
    label_ (val) { this.$emit('update:label', val) },
    label (val) { this.label_ = val },
  },
}
</script>
