export default {
  data () {
    return {
      exiting: false,
      exitSaveError: false,
    }
  },
  watch: {
    saveState (val) {
      this.$root.$children[0].appBarSubtitle = this.$t(`plugin.ess.saveHint.${val}`)
      switch (val) {
      case 'saved':
        window.onbeforeunload = null
        break

      case 'saving':
      case 'awaitInputStop':
        window.onbeforeunload = e => {
          e.preventDefault()
          e.returnValue = true
          return true
        }
        break
      }
    },
  },
  destroyed () {
    this.$root.$children[0].appBarSubtitle = ''
    window.onbeforeunload = null
  },
  async beforeRouteLeave (_to, _from, next) {
    if (this.saveState === 'saving' || this.saveState === 'awaitInputStop') {
      this.exiting = true
      try {
        await this.update()
      } catch (e) {
        console.error('error saving before leave', e)
        next(false)
        this.exitSaveError = true
        return
      }
    }
    next()
  },
}
