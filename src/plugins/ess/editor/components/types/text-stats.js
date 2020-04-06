export const textStatsMixin = {
  props: { stats: {} },
  computed: {
    statsData () {
      if (!this.stats) return null
      const empty = this.$t('core.question.stats.textEmpty')
      const stats = this.stats.data
      return Array
        .from(new Set(stats))
        .map(v => ({ value: v || empty, count: stats.filter(x => v === x).length }))
    },
  },
}
