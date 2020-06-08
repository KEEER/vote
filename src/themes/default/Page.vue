<template>
  <div :class="current ? 'page current' : 'page'">
    <Question
      v-for="question in page"
      :key="question.id"
      :id="question.id"
      :type="question.type"
      :value="question.value"
      :data="question"
      ref="questions"
    />
  </div>
</template>

<style scoped>
.page { display: none; }
.page.current { display: block; }
</style>

<script>
import hooks from './hooks'
import Question from './Question.vue'

export default {
  name: 'Page',
  inject: [ 'data' ],
  components: { Question },
  computed: {
    questions () { return this.$refs.questions },
    valid () {
      let validity = this.questions.every(q => q.valid)
      /**
       * Page validation override event.
       * @event form.page:validate
       * @type {object}
       * @property {form:Page} page the page Vue instance
       * @property {function} invalidate call to invalidate
       */
      hooks.emit('page:validate', { page: this, invalidate: () => validity = false })
      return validity
    },
  },
  mounted () {
    this.$on('validateNext', () => {
      for (const q of this.questions) hooks.emit('question:update', { question: q.$refs.questionContent, value: q.value, oldValue: q.value })
      if (this.valid) return
      window.scrollBy(0, this.questions.filter(q => !q.valid)[0].$refs.questionContent.$el.getBoundingClientRect().y - 200)
    })
  },
  props: { page: Array, current: Boolean },
}
</script>
