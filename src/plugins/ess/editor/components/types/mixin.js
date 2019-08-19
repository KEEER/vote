export default {
  data() {
    return {
      value_: this.value,
    }
  },
  props: {
    options: {},
    texts: Object,
  },
  watch: {
    value_(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.value_ = val
    },
  },
}
