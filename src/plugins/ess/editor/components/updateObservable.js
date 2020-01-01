export default {
  data () {
    return {
      change: {},
      changed: false,
      lastChanged: Date.now(),
      lastUpdated: Date.now(),
      saveState: 'notChanged',
      intervalId: -1,
      UPDATE_THRESHOLD: {
        // After data.UPDATE_THRESHOLD.NOT_CHANGED ms without change, update
        NOT_CHANGED: 2 * 1000, // 3 secs
        // After data.UPDATE_THRESHOLD.NOT_UPDATED ms without update, update
        NOT_UPDATED: 10 * 1000, // 10 secs
      },
    }
  },
  watch: {
    saveState (val) {
      this.$emit('update:saveState', val)
    },
  },
  methods: {
    logChange () {
      this.changed = true
      this.lastChanged = Date.now()
      this.saveState = 'awaitInputStop'
    },
    checkUpdate () {
      if (!this.changed) return
      if (this.lastChanged + this.UPDATE_THRESHOLD.NOT_CHANGED < Date.now()) {
        return this.update()
      }
      if (this.lastUpdated + this.UPDATE_THRESHOLD.NOT_UPDATED < Date.now()) {
        return this.update()
      }
    },
  },
  mounted () {
    this.intervalId = setInterval(() => this.checkUpdate(), 500)
  },
}
