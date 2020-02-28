<template>
  <m-select
    :id="uid"
    outlined
    enhanced
    v-model="value_"
  >
    <m-list-item
      v-for="(name, i) in this.types"
      :key="i"
      :data-value="name"
      aria-selected="false"
    >{{$t(`core.question.types.${name}`)}}</m-list-item>
    <m-floating-label
      :for="uid"
      slot="label"
    >{{$t('plugin.ess.question.type')}}</m-floating-label>
  </m-select>
</template>

<script>
import hooks from '../hooks'
import types from './types'

export default {
  name: 'TypeSelector',
  data () {
    return {
      value_: this.value,
      types: Object.keys(types).filter(t => this.$te(`core.question.types.${t}`)),
    }
  },
  props: {
    value: String,
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
    hooks.emit('editor:typeSelectorMounted', [ this ])
  },
}
</script>
