<template>
  <m-dialog v-model="open_" scrollable>
    <m-typo-headline :level="5" slot="header">{{ $t('plugin.ess.editor.config') }}</m-typo-headline>
    <m-typo-body v-if="showEntries" :level="1" slot="body">
      <span class="entry" v-for="(entry, i) in enabledEntries" :key="entry.name">
        <span class="checkbox-entry" v-if="entry.type === 'checkbox'">
          <m-checkbox :id="`${uid}-${i}`" v-model="value_[entry.name]" @change="syncValue"></m-checkbox>
          <label :for="`${uid}-${i}`">{{ $t(entry.label) }}</label>
        </span>
        <span class="switch-entry" v-if="entry.type === 'switch'">
          <m-switch class="switch" :id="`${uid}-${i}`" v-model="value_[entry.name]" @change="syncValue"></m-switch>
          <label :for="`${uid}-${i}`">{{ $t(entry.label) }}</label>
        </span>
        <span class="cascade-entry" v-if="entry.type === 'cascade'">
          <m-select
            v-for="(sel, j) in generateCascade(entry.options, value_[entry.name])"
            :key="sel.label"
            outlined
            enhanced
            width="200px"
            :required="!!entry.required"
            :id="`${uid}-${i}-${j}`"
            v-model="value_[entry.name][j]"
            @model="syncValue()"
          >
            <m-list-item v-for="(item, k) in sel.items" :key="k" :data-value="item.value">{{ $t(item.label) }}</m-list-item>
            <m-floating-label :for="`${uid}-${i}-${j}`" slot="label">{{ $t(sel.label) }}</m-floating-label>
          </m-select>
        </span>
        <span class="text-field-entry" v-if="entry.type === 'text-field'">
          <m-text-field
            outlined
            :required="!!entry.required"
            v-model="value_[entry.name]"
            :id="`${uid}-${i}`"
            :ref="`${uid}-${i}`"
            :type="entry.validation === 'number' ? 'number' : 'text'"
            @model="$refs[`${uid}-${i}`][0].mdcTextField.valid ? syncValue() : null"
          >
            <m-floating-label :for="`${uid}-${i}`">{{ $t(entry.label) }}</m-floating-label>
          </m-text-field>
        </span>
      </span>
    </m-typo-body>
    <m-button
      class="mdc-dialog__button"
      data-mdc-dialog-action="OK"
      slot="acceptButton"
    >{{ $t('plugin.ess.editor.ok') }}</m-button>
  </m-dialog>
</template>

<style scoped>
.entry {
  display: block;
  margin: 8px;
}

.checkbox-entry, .switch-entry {
  display: flex;
  align-items: center;
}

.switch { margin: 16px 12px 16px 8px; }
</style>

<script>
const types = [ 'checkbox', 'switch', 'cascade', 'text-field' ]

export default {
  name: 'QuestionConfigDialog',
  data () {
    return {
      open_: false,
      value_: this.value || {},
      showEntries: false,
    }
  },
  watch: {
    open_ (val) { this.$emit('update:open', val) },
    open (val) { this.open_ = val },
    value_ (val) { this.$emit('input', val) },
    value (val) { this.value_ = val },
  },
  computed: {
    enabledEntries () {
      return this.entries.filter(entry => {
        if (!('if' in entry)) return true
        if (typeof entry.if === 'function') return entry.if(this.value_)
        if (typeof entry.if === 'boolean') return entry.if
        throw new Error(`Unrecognized entry.if type: ${typeof entry.if}, expected function|boolean`)
      })
    },
  },
  methods: {
    syncValue () {
      this.$emit('input', { ...this.value_ })
    },
    generateCascade: function* (root, value, offset = 0) {
      yield {
        label: root.nextLabel || root.label,
        items: root.children,
      }
      let option = root.children.find(c => c.value === value[offset])
      if (!option) {
        option = root.children[0]
        // not `value[offset] = option.value` because of Vue reactivity caveats
        // see https://vuejs.org/v2/guide/reactivity.html#For-Arrays
        this.$set(value, offset, option.value)
      }
      if (option.children) yield* this.generateCascade(option, value, offset + 1)
      else if (value.length > offset + 1) value.splice(offset + 1) // not `value.length = offset + 1`
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
    this.$nextTick(() => this.$nextTick(() => this.showEntries = true))
  },
  created () {
    for (let entry of this.entries) {
      if ('default' in entry && !(entry.name in this.value_)) {
        this.value_[entry.name] = entry.default
      }
    }
  },
}
</script>
