<template>
  <m-select
    :id="uid"
    outlined
    enhanced
    v-model="value_"
  >
    <m-list-item
      v-for="(name, value) in $t('core.question.types')"
      :key="value"
      :data-value="value"
      aria-selected="false"
    >{{name}}</m-list-item>
    <m-floating-label
      :for="uid"
      slot="label"
    >{{$t('plugin.ess.question.type')}}</m-floating-label>
  </m-select>
</template>

<script>
import hooks from '../hooks'

export default {
  name: 'TypeSelector',
  data () {
    return {
      value_: this.value,
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
