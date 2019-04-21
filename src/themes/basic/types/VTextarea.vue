<template>
  <div>
    <h3>{{data.title}}</h3>
    <textarea v-model="value_" />
  </div>
</template>

<script>
export default {
  name: 'VTextarea',
  data() {
    return {value_: this.$attrs.value}
  },
  watch: {
    value(val) {
      this.value_ = val
    },
  },
  props: {
    data: {
      type: Object,
      validator(val) {
        return val.title
      },
    },
  },
}
</script>
