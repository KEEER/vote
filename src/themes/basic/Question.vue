<template>
  <div>
    <QTitle :title="data.title" :required="data.required" />
    <div v-html="(data.description || {}).html || ''"></div>
    <component
      :is="type"
      :data="data"
      :value.sync="value"
      ref="realQuestion">
      <slot />
    </component>
  </div>
</template>

<script>
import * as types from './types.js'
import hooks from './hooks'
import QTitle from './Title.vue'

export default {
  name: 'Question',
  data () {
    return {
      value: this.$attrs.value,
    }
  },
  components: {
    ...types,
    QTitle,
  },
  props: {
    type: {
      type: String,
      validator (val) {
        return val in types
      },
    },
    data: Object,
    id: Number,
  },
  computed: {
    valid () {
      let valid = !this.data.required || !!this.value
      hooks.emit('question:validate', [ this, v => valid = v ])
      return valid
    },
  },
  provide () {
    return { Question: this }
  },
}
</script>
