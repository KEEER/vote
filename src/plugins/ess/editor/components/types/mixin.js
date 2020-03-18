export default {
  data () {
    return {
      value_: this.value || '',
    }
  },
  props: {
    route: String,
    stats: {},
  },
  computed: {
    isEditor () { return this.route === 'editor' },
    isData () { return this.route === 'data' },
    isStats () { return this.route === 'stats' },
  },
  watch: {
    value_ (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.value_ = val
    },
  },
}
