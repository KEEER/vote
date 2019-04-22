export default {
  data() {
    return {
      value_: this.value,
    }
  },
  watch: {
    value_(val) {
      this.$emit('update:value', val)
    },
    value(val) {
      this.value_ = val
    },
  },
}
