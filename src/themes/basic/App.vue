<template>
  <div class="vote-main">
    <h1 v-if="nodata">{{nodataTip}}</h1>
    <Form v-else :title="data.title" :action="data.action" :method="data.method">
      <Page v-for="(page, i) in data.data" :key="i">
        <Question
          v-for="question in page"
          :key="question.id"
          :id="question.id"
          :type="question.type"
          :value="question.value"
          :data="question" />
      </Page>
    </Form>
    <footer class="vote-footer"><a href="/?utm_source=form&utm_medium=footer">Powered by KEEER Vote</a></footer>
  </div>
</template>

<style scoped>
.vote-footer {
  padding: 8px 0;
}
</style>

<script>
import Form, {Question, Page} from './Form'
import hooks from './hooks'

export default {
  components: {
    Form,
    Question,
    Page,
  },
  data() {
    return {
      nodata: !('KVoteFormData' in window),
      data: window.KVoteFormData,
    }
  },
  computed: {
    nodataTip() {
      let tip = 'No form data supplied. This is usually an error in the URL.'
      hooks.emit('app:nodata', [this, t => tip = t])
      return tip
    },
  },
}
</script>
