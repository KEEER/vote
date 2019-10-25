<template>
  <main id="editor">
    <div v-if="exitSaveError">{{texts.exitSaveError}}</div>
    <div v-else-if="exiting">{{texts.exiting}}</div>
    <div id="questions" v-else-if="questionLoaded">
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
            @update:saveState="updateSaveState"
          />
        </transition-group>
      </draggable>
      <div class="bottom-new">
        <m-button @click="newQuestion" unelevated>
          <m-icon slot="icon" icon="add" />
          {{texts.new}}
        </m-button>
      </div>
    </div>
    <div v-else-if="questionLoadError">{{texts.questionLoadError}}</div>
    <div v-else-if="exiting">{{texts.exiting}}</div>
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
  opacity: 0.5;
}

.bottom-new {
  text-align: center;
  width: 100%;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button/button.min.js'
import MIcon from 'material-components-vue/dist/icon/icon.min.js'
import Question from './components/Question'
import hooks from './hooks'
import {types as questionTypes} from '../../../question'
import {query} from '../common/graphql'
import draggable from 'vuedraggable'

Vue.use(MButton)
Vue.use(MIcon)

export default {
  name: 'Editor',
  components: {
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
        exiting: 'Saving questions, please wait...',
        exitSaveError: 'Error saving question, data may be not saved. Please refresh to continue.',
        question: {
          title: 'Question Title',
          required: 'Required',
          type: 'Question Type',
          valuePlaceholder: 'Default Value',
          labelPlaceholder: 'Label',
          nulltype: 'Please specify a question type.',
          default: {
            type: 'VText',
            title: 'New Question',
          },
        },
        updateError: 'Error occurred while updating the question.',
        removeError: 'Error occurred while removing the question.',
        saveHint: {
          notChanged: 'Autosave Enabled',
          awaitInputStop: 'Waiting for you to stop input...',
          saving: 'Saving...',
          saved: 'Saved to cloud',
        },
      },
      newQuestionDialogOpen: false,
      currentPageId: 0,
      pageCount: 0,
      questionTypes,
      questionLoaded: false,
      questionLoadError: false,
      exiting: false,
      exitSaveError: false,
      pages: [],
      questions: [],
      dragging: false,
      saveState: null,
    }
  },
  methods: {
    async loadQuestions() {
      try {
        const res = await query(`
          query($id: Int!) {
            form {
              page(id: $id) {
                questions { type, title, id, value, required, options }
              }
              pageCount
            }
          }`.trim(), {
          id: this.currentPageId,
        })
        if(res.errors) throw res
        this.questions = res.data.form.page.questions
        for(let i of ['value', 'options']) {
          for(let question of this.questions) {
            question[i] = JSON.parse(question[i])
          }
        }
        this.pageCount = res.data.form.pageCount
        this.questionLoaded = true
      } catch(e) {
        console.error(e)
        this.questionLoadError = true
      }
    },
    async newQuestion() {
      try {
        const res = await query(`
          mutation NewQuestion($pageId: Int!, $options: QuestionInput!) {
            newQuestion(pageId: $pageId, options: $options)
          }`.trim(), {
          pageId: this.currentPageId,
          options: this.texts.question.default,
        })
        if(res.errors) {
          throw res
        } else {
          this.questions.push(Object.assign({id: res.data.newQuestion}, this.texts.question.default))
          this.$nextTick(() => window.scrollTo(0, 1048576))
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
    move(item) {
      this.dragging = false
      const q = this.$refs[`question-${item.newIndex}`][0]
      q.$emit('reorder', item.newIndex - item.oldIndex)
    },
    updateSaveState(state) {
      switch(this.saveState) {
      case 'notChanged':
      case 'saved':
        this.saveState = state
        break

      case 'saving':
        if(state === 'awaitInputStop' || state === 'saved') this.saveState = state
        break

      case 'awaitInputStop':
        if(state === 'saving') this.saveState = state
        break

      default:
        break
      }
    },
  },
  mounted() {
    hooks.emit('editor:editorMounted', [this])
    this.loadQuestions()
    this.saveState = 'notChanged'
  },
  async beforeRouteLeave(to, from, next) {
    if(this.saveState === 'saving' || this.saveState === 'awaitInputStop') {
      this.exiting = true
      try {
        await Promise.all(this.questions.map((_, i) => this.$refs[`question-${i}`][0].update()))
      } catch(e) {
        console.error('error saving before leave', e)
        next(false)
        this.exitSaveError = true
        return
      }
    }
    next()
  },
  destroyed() {
    this.$root.$children[0].texts.appBarSubtitle = ''
    window.onbeforeunload = null
  },
  watch: {
    saveState(val) {
      this.$root.$children[0].texts.appBarSubtitle = this.texts.saveHint[val]
      switch(val) {
      case 'saved':
        window.onbeforeunload = null
        break

      case 'saving':
      case 'awaitInputStop':
        window.onbeforeunload = e => {
          e.preventDefault()
          e.returnValue = true
          return true
        }
        break
      }
    },
  },
}
</script>
