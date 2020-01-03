<template>
  <m-select
    :id="uid"
    outlined
    enhanced
    v-model="value_"
  >
    <m-list-item
      v-for="(name, value) in questionTypes"
      :key="value"
      :data-value="value"
      aria-selected="false"
    >{{name}}</m-list-item>
    <m-floating-label
      :for="uid"
      slot="label"
    >{{texts.question.type}}</m-floating-label>
  </m-select>
</template>

<style lang="scss">

@import '../styles.scss';
@import 'material-components-vue/components/select/styles';
@import 'material-components-vue/components/list/styles';
</style>

<script>
import MSelect from 'material-components-vue/components/select/'
import MList from 'material-components-vue/components/list/'
import { types as questionTypes } from '../../../../question'

Vue.use(MSelect)
Vue.use(MList)

export default {
  name: 'TypeSelector',
  data () {
    return {
      value_: this.value,
      questionTypes,
    }
  },
  props: {
    value: String,
    texts: Object,
  },
  watch: {
    value (val) {
      this.value_ = val
    },
    value_ (val) {
      this.$emit('input', val)
    },
  },
}
</script>
