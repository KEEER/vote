<template>
  <m-select
    :id="uid"
    v-model="value_"
    outlined
    enhanced
    :width="$t('plugin.ess.question.typeSelectorWidth')"
  >
    <m-list-item
      v-for="(name, i) in types"
      :key="i"
      :data-value="name"
      aria-selected="false"
    >
      {{ $t(`core.question.types.${name}`) }}
    </m-list-item>
    <m-floating-label
      slot="label"
      :for="uid"
      v-text="$t('plugin.ess.question.type')"
    />
  </m-select>
</template>

<script>
import hooks from '../hooks'
import types from './types'

export default {
  name: 'TypeSelector',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      value_: this.value,
      types: Object.keys(types).filter(t => this.$te(`core.question.types.${t}`)),
    }
  },
  watch: {
    value (val) {
      this.value_ = val
    },
    value_ (val) {
      this.$emit('input', val)
    },
  },
  mounted () {
    /**
     * TypeSelector mounted event.
     * @event editor.editor:typeSelectorMounted
     * @type {editor:TypeSelector}
     */
    hooks.emit('editor:typeSelectorMounted', this)
  },
}
</script>
