export default {
  data () {
    return { saveState: null }
  },
  methods: {
    updateSaveState (state) {
      switch (this.saveState) {
      case 'notChanged':
      case 'saved':
        this.saveState = state
        break

      case 'saving':
        if (state === 'awaitInputStop' || state === 'saved') this.saveState = state
        break

      case 'awaitInputStop':
        if (state === 'saving') this.saveState = state
        break

      default:
        break
      }
    },
  },
  watch: {
    saveState (val) {
      this.$emit('update:saveState', val)
    },
  },
  mounted () {
    this.saveState = 'notChanged'
  },
}
