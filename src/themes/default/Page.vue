<template>
  <div :class="this.current ? 'page current' : 'page'">
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
.page {
  display: none;
}
.page.current {
  display: block;
}
</style>

<script>
import hooks from './hooks'
import Question from './Question.vue'

export default {
  name: 'Page',
  inject: [ 'data' ],
  data () {
    return {
      current: false,
    }
  },
  components: { Question },
  computed: {
    questions () { return this.$refs.questions },
    valid () {
      let validity = this.questions.every(q => q.valid)
      hooks.emit('page:validate', [ this, () => validity = false ])
      return validity
    },
  },
  mounted () {
    this.$on('validateNext', () => {
      for (const q of this.questions) hooks.emit('question:update', [ q.$refs.realQuestion, q.value, q.value ])
      if (this.valid) return
      window.scrollBy(0, this.questions.filter(q => !q.valid)[0].$refs.realQuestion.$el.getBoundingClientRect().y - 200)
    })
  },
  props: { page: Array },
}
</script>
