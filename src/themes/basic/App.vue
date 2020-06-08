<template>
  <div class="vote-main">
    <h1 v-if="nodata" v-text="nodataTip" />
    <Form v-else :title="data.title" :action="data.action" :method="data.method">
      <Page v-for="(page, i) in data.data" :key="i">
        <Question
          v-for="question in page"
          :id="question.id"
          :key="question.id"
          :type="question.type"
          :value="question.value"
          :data="question"
        />
      </Page>
    </Form>
    <footer class="vote-footer">
      <a href="/?utm_source=form&utm_medium=footer" v-text="$t('theme.basic.footer')" />
    </footer>
  </div>
</template>

<style scoped>
.vote-footer {
  padding: 8px 0;
}
</style>

<script>
import Form, { Question, Page } from './Form'
import hooks from './hooks'

export default {
  components: {
    Form,
    Question,
    Page,
  },
  data () {
    return {
      nodata: !('KVoteFormData' in window),
      data: window.KVoteFormData,
    }
  },
  computed: {
    nodataTip () {
      let tip = 'No form data supplied. This is usually an error in the URL.'
      /**
       * Data (window.KVoteFormData) not found event. Note that this event is `theme-basic`-only.
       * @deprecated
       * @event form.app:nodata
       * @type {object}
       * @property {form:App} vm the Vue instance
       * @property {function} set setter for tip to show
       */
      hooks.emit('app:nodata', { vm: this, set: t => tip = t })
      return tip
    },
  },
}
</script>
