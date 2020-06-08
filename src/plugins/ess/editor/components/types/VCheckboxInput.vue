<template>
  <li class="checkbox-li">
    <m-icon-button v-if="isEditor" icon="remove" @click="remove" />
    <m-checkbox v-model="value_" :disabled="isData" :value="cbvalue" />
    <m-text-field v-if="isEditor" :id="uid" v-model="label_" outlined class="label">
      <m-floating-label :for="uid" v-text="$t('plugin.ess.question.labelPlaceholder')" />
    </m-text-field>
    <span v-else v-text="label_" />
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
  props: {
    label: String,
    value: Boolean,
    cbvalue: {},
    route: String,
  },
  data () {
    return {
      value_: this.value,
      label_: this.label,
    }
  },
  computed: {
    isEditor () { return this.route === 'editor' },
    isData () { return this.route === 'data' },
  },
  watch: {
    value_ (val) { this.$emit('update:value', val) },
    value (val) { this.value_ = val },
    label_ (val) { this.$emit('update:label', val) },
    label (val) { this.label_ = val },
  },
  methods: {
    remove () { this.$emit('remove') },
  },
}
</script>
