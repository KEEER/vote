import { query } from '../common/graphql'

export default {
  data () {
    return {
      settingsData: null,
      settingsLoaded: false,
      settingsLoadError: false,
    }
  },
  methods: {
    async loadSettings () {
      try {
        const res = await query('{ form { data } }', {})
        if (res.errors) throw res
        this.settingsData = (JSON.parse(res.data.form.data) || {}).settings || {}
        this.settingsLoaded = true
      } catch (e) {
        console.error(e)
        this.settingsLoadError = true
      }
    },
  },
}
