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
      /**
       * Question update event.
       * @event form:Question#update:value
       * @type {any}
       */
      this.$emit('update:value', val)
      /**
       * Question update event.
       * @event form.question:update
       * @type {object}
       * @property {form:Question} question Vue instance of the (real / inner) question
       * @property {any} value new value
       * @property {any} oldValue old value
       */
      window.voteHooks.emit('question:update', { question: this, value: val, oldValue: this.old })
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
