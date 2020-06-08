<template>
  <m-dialog v-model="open_" scrollable>
    <m-typo-headline slot="header" :level="5" v-text="$t('plugin.ess.editor.config')" />
    <m-typo-body v-if="showEntries" slot="body" :level="1">
      <span v-for="(entry, i) in enabledEntries" :key="entry.name" class="entry">
        <span v-if="entry.type === 'checkbox'" class="checkbox-entry">
          <m-checkbox :id="`${uid}-${i}`" v-model="value_[entry.name]" @change="syncValue" />
          <label :for="`${uid}-${i}`" v-text="$t(entry.label)" />
        </span>
        <span v-if="entry.type === 'switch'" class="switch-entry">
          <m-switch :id="`${uid}-${i}`" v-model="value_[entry.name]" class="switch" @change="syncValue" />
          <label :for="`${uid}-${i}`" v-text="$t(entry.label)" />
        </span>
        <span v-if="entry.type === 'cascade'" class="cascade-entry">
          <m-select
            v-for="(sel, j) in generateCascade(entry.options, value_[entry.name])"
            :id="`${uid}-${i}-${j}`"
            :key="sel.label"
            v-model="value_[entry.name][j]"
            outlined
            enhanced
            width="200px"
            :required="!!entry.required"
            @model="syncValue()"
          >
            <m-list-item v-for="(item, k) in sel.items" :key="k" :data-value="item.value" v-text="$t(item.label)" />
            <m-floating-label slot="label" :for="`${uid}-${i}-${j}`" v-text="$t(sel.label)" />
          </m-select>
        </span>
        <span v-if="entry.type === 'text-field'" class="text-field-entry">
          <m-text-field
            :id="`${uid}-${i}`"
            :ref="`${uid}-${i}`"
            v-model="value_[entry.name]"
            outlined
            :required="!!entry.required"
            :type="entry.validation === 'number' ? 'number' : 'text'"
            @model="$refs[`${uid}-${i}`][0].mdcTextField.valid ? syncValue() : null"
          >
            <m-floating-label :for="`${uid}-${i}`" v-text="$t(entry.label)" />
          </m-text-field>
        </span>
      </span>
    </m-typo-body>
    <m-button
      slot="acceptButton"
      class="mdc-dialog__button"
      data-mdc-dialog-action="OK"
      v-text="$t('plugin.ess.editor.ok')"
    />
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
  props: {
    entries: {
      type: Array,
      required: true,
      validator (val) {
        if (!Array.isArray(val)) return false
        for (const entry of val) {
          if (!('label' in entry)) return false
          if (!('name' in entry)) return false
          if (!('type' in entry) || !types.includes(entry.type)) return false
        }
        return true
      },
    },
    open: Boolean,
    value: {},
  },
  data () {
    return {
      open_: false,
      value_: this.value || {},
      showEntries: false,
    }
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
  watch: {
    open_ (val) { this.$emit('update:open', val) },
    open (val) { this.open_ = val },
    value_ (val) { this.$emit('input', val) },
    value (val) { this.value_ = val },
  },
  mounted () {
    this.$nextTick(() => this.open_ = this.open)
    this.$nextTick(() => this.$nextTick(() => this.showEntries = true))
  },
  created () {
    for (const entry of this.entries) {
      if ('default' in entry && !(entry.name in this.value_)) {
        this.value_[entry.name] = entry.default
      }
    }
  },
  methods: {
    syncValue () {
      this.$emit('input', { ...this.value_ })
    },
    *generateCascade (root, value, offset = 0) {
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
}
</script>
