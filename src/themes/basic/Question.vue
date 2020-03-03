<template>
  <div>
    <QTitle :title="data.title" :required="data.required" />
    <div v-html="(data.description || {}).html || ''"></div>
    <component
      :is="types[type]"
      :data="data"
      :value.sync="value"
      ref="realQuestion">
      <slot />
    </component>
    <div class="invalid-tip" v-if="invalidTip">{{invalidTip}}</div>
  </div>
</template>

<style scoped>
.invalid-tip {
  color: #d93025;
}
</style>

<script>
import { types } from './types'
import hooks from './hooks'
import QTitle from './Title.vue'

export default {
  name: 'Question',
  data () {
    return {
      value: this.$attrs.value,
      types,
      invalidTip: '',
    }
  },
  components: {
    QTitle,
  },
  props: {
    type: String,
    data: Object,
    id: Number,
  },
  computed: {
    validity () {
      let res
      hooks.emit('question:validate', [ this, r => res = { valid: false, reason: r } ])
      if (typeof res === 'undefined') return { valid: true }
      return res
    },
    valid () { return this.validity.valid },
  },
  provide () {
    return { Question: this }
  },
}
</script>
