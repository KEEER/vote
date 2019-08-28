<template>
  <main id="editor">
    <m-button id="new-question" @click="newQuestionDialogOpen = true" unelevated>{{texts.new}}</m-button>
    <NewQuestionDialog ref="newQuestionDialog" :open.sync="newQuestionDialogOpen" :texts="texts" @newQuestion="newQuestion" />
    <div id="questions" v-if="questionLoaded">
      <draggable
        v-model="questions"
        @start="dragging = true"
        @end="move"
        :animation="200"
        handle=".handle"
        ghost-class="ghost"
      >
        <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
          <Question v-for="(question, i) in questions"
            :key="question.id"
            :data="question"
            :texts="texts"
            @remove="remove(i)"
            :ref="`question-${i}`"
          />
        </transition-group>
      </draggable>
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

.ghost {
  opacity: 0.7;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button/button.min.js'
import NewQuestionDialog from './components/NewQuestionDialog'
import Question from './components/Question'
import hooks from './hooks'
import {types as questionTypes} from '../../../question'
import {query} from '../common/graphql'
import draggable from 'vuedraggable'

Vue.use(MButton)

export default {
  name: 'Editor',
  components: {
    NewQuestionDialog,
    Question,
    draggable,
  },
  data() {
    return {
      texts: {
        new: 'Add question',
        cancel: 'Cancel',
        ok: 'OK',
        questionLoadError: 'Load Error',
        questionLoading: 'Loading Questions...',
        question: {
          title: 'Question Title',
          required: 'Required',
          type: 'Question Type',
          valuePlaceholder: 'Default Value',
          nulltype: 'Please specify a question type.',
        },
        updateError: 'Error occurred while updating the question.',
        removeError: 'Error occurred while removing the question.',
      },
      newQuestionDialogOpen: false,
      currentPageId: 0,
      questionTypes,
      questionLoaded: false,
      questionLoadError: false,
      pages: [],
      questions: [],
      dragging: false,
    }
  },
  methods: {
    async loadQuestions() {
      try {
        const res = await query('{ form { pages { questions { type, title, id, value, required, options } } } }')
        if(res.errors) throw res
        this.pages = res.data.form.pages
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
        const res = await query(`
          mutation NewQuestion($pageId: Int!, $options: QuestionInput!) {
            newQuestion(pageId: $pageId, options: $options)
          }`.trim(), {
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
    remove(i) {
      this.questions.splice(i, 1)
    },
    up(i) {
      const q = this.questions
      ;[q[i - 1], q[i]] = [q[i], q[i - 1]]
      // The following line is intended to fix Vue reactivity caveats
      // this.questions = [...q]
    },
    down(i) {
      const q = this.questions
      ;[q[i + 1], q[i]] = [q[i], q[i + 1]]
      // this.questions = [...q]
    },
    move(item) {
      this.dragging = false
      const q = this.$refs[`question-${item.newIndex}`][0]
      q.$emit('reorder', item.newIndex - item.oldIndex)
    },
  },
  mounted() {
    hooks.emit('editor:editorMounted', [this])
    this.loadQuestions()
  },
}
</script>
