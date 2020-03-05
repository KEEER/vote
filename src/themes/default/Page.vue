<template>
  <div :class="this.current ? 'page current' : 'page'">
    <Question
      v-for="question in page"
      :key="question.id"
      :id="question.id"
      :type="question.type"
      :value="question.value"
      :data="question"
      :ref="questions"
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
  props: { page: Array },
}
</script>
