<template>
  <main id="editor">
    <m-button id="new-question" @click="newQuestionDialogOpen = true" unelevated>{{texts.new}}</m-button>
    <NewQuestionDialog ref="newQuestionDialog" :open.sync="newQuestionDialogOpen" :texts="texts" @newQuestion="newQuestion" />
    <Question />
  </main>
</template>

<style lang="scss">
@import './styles.scss';
@import 'material-components-vue/dist/button/styles';
</style>

<style scoped>
#new-question {
  float: right;
}

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
        newQuestionType: 'Question Type',
        newQuestionTitle: 'Question Title',
        newQuestionRequired: 'Required',
      },
      newQuestionDialogOpen: false,
      currentPageId: 0,
      questionTypes,
    }
  },
  methods: {
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
        alert('我们遇到了一个错误……')
        console.error(e)
      }
    },
  },
  mounted() {
    hooks.emit('editor:editorMounted', [this])
  },
}
</script>
