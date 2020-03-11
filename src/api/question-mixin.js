export const questionMixin = {
  inject: [ 'Question' ],
  data () {
    return {
      value_: this.value,
      old: null,
    }
  },
  methods: {
    syncOld () {
      this.old = this.value_
    },
  },
  watch: {
    value_ (val) {
      this.$emit('update:value', val)
      window.voteHooks.emit('question:update', [ this, val, this.old ])
      this.syncOld()
    },
    value (val) {
      this.value_ = val
    },
  },
  mounted () {
    this.syncOld()
  },
  computed: {
    overridesParent () {
      return !!this.question_
    },
    question () {
      return this.question_ || this.$parent
    },
    realQuestion () {
      return this.question.$refs.realQuestion
    },
  },
}
