<template>
  <m-dialog class="new-question-dialog" v-model="open_" scrollable>
    <m-typo-headline :level="5" slot="header">{{$t('plugin.ess.editor.config')}}</m-typo-headline>
    <m-typo-body :level="1" slot="body">
      <span class="entry" v-for="(entry, i) in entries" :key="i">
        <span class="checkbox-entry" v-if="entry.type === 'checkbox'">
          <m-checkbox :id="`${uid}-${i}`" v-model="value_[entry.name]" @change="syncValue"></m-checkbox>
          <label :for="`${uid}-${i}`">{{$t(entry.label)}}</label>
        </span>
      </span>
    </m-typo-body>
    <m-button
      class="mdc-dialog__button"
      data-mdc-dialog-action="OK"
      slot="acceptButton"
    >{{$t('plugin.ess.editor.ok')}}</m-button>
  </m-dialog>
</template>

<style scoped>
.entry {
  display: block;
}

.checkbox-entry {
  display: flex;
  align-items: center;
}
</style>

<script>
const types = [ 'checkbox' ]

export default {
  name: 'QuestionConfigDialog',
  data () {
    return {
      open_: false,
      value_: this.value || {},
    }
  },
  watch: {
    open_ (val) { this.$emit('update:open', val) },
    open (val) { this.open_ = val },
    value_ (val) { this.$emit('input', val) },
    value (val) { this.value_ = val },
  },
  methods: {
    syncValue () {
      this.$emit('input', { ...this.value_ })
    },
  },
  props: {
    entries: {
      type: Array,
      required: true,
      validator (val) {
        if (!Array.isArray(val)) return false
        for (let entry of val) {
          if (!('label' in entry)) return false
          if (!('name' in entry)) return false
          if (!('type' in entry) || types.indexOf(entry.type) < 0) return false
        }
        return true
      },
    },
    open: Boolean,
    value: {},
  },
  mounted () {
    this.$nextTick(() => this.open_ = this.open)
    for (let entry of this.entries) {
      if ('default' in entry && !(entry.name in this.value_)) {
        this.value_[entry.name] = entry.default
      }
    }
  },
}
</script>
