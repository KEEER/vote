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
  </div>
</template>

<script>
// import Vue from 'vue'
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
