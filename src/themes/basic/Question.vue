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
  </div>
</template>

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
