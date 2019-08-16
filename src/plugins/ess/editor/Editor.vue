<template>
  <main id="editor">
    <m-button id="new-question" @click="newQuestionDialogOpen = true" unelevated>{{texts.new}}</m-button>
    <NewQuestionDialog ref="newQuestionDialog" :open.sync="newQuestionDialogOpen" :texts="texts" @newQuestion="newQuestion" />
    <div id="questions" v-if="questionLoaded">
      <Question v-for="(question, i) in questions"
        :key="i"
        :data="question"
        :texts="texts" />
    </div>
    <div v-else-if="questionLoadError">{{texts.questionLoadError}}</div>
    <div v-else>{{texts.questionLoading}}</div>
  </main>
</template>

<style lang="scss">
@import './styles.scss';
@import 'material-components-vue/dist/button/styles';
</style>

<style scoped>
main {
  padding: 10px;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button/button.min.js'
import NewQuestionDialog from './components/NewQuestionDialog'
import Question from './components/Question'
import hooks from './hooks'
import {types as questionTypes} from '../../../question'
import {query} from '../common/graphql'

Vue.use(MButton)

export default {
  name: 'Editor',
  components: {
    NewQuestionDialog,
    Question,
  },
  data() {
    return {
      texts: {
        new: 'Add question',
        cancel: 'Cancel',
        ok: 'OK',
        newQuestion: {
          type: 'Question Type',
          title: 'Question Title',
          required: 'Required',
        },
        questionLoadError: 'Load Error',
        questionLoading: 'Loading Questions...',
      },
      newQuestionDialogOpen: false,
      currentPageId: 0,
      questionTypes,
      questionLoaded: false,
      questionLoadError: false,
      questions: [],
    }
  },
  methods: {
    async loadQuestions() {
      try {
        const res = await query('{ form { pages { questions { type, title, id, value, required, options } } } }')
        if(res.errors) throw res
        this.questions = res.data.form.pages[this.currentPageId].questions
        this.questionLoaded = true
      } catch(e) {
        console.error(e)
        this.questionLoadError = true
      }
    },
    async newQuestion() {
      try {
        const dialog = this.$refs.newQuestionDialog.$data.data
        // TODO: ask user for these params
        const res = await query(`
          mutation NewQuestion($pageId: Int!, $options: QuestionInput!) {
            newQuestion(pageId: $pageId, options: $options)
          }`, {
          pageId: this.currentPageId,
          options: dialog,
        })
        if(res.errors || !res.data.newQuestion) {
          throw res
        } else {
          // TODO: apply new question
          alert('added')
        }
      } catch(e) {
        // TODO: replace this hint
        alert('我们遇到了一个错误……')
        console.error(e)
      }
    },
  },
  mounted() {
    hooks.emit('editor:editorMounted', [this])
    this.loadQuestions()
  },
}
</script>
