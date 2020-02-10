<template>
  <main id="editor">
    <div v-if="exitSaveError">{{$t('plugin.ess.editor.exitSaveError')}}</div>
    <div v-else-if="exiting">{{$t('plugin.ess.editor.exiting')}}</div>
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
            @remove="remove(i)"
            :ref="`question-${i}`"
            @update:saveState="updateSaveState"
          />
        </transition-group>
      </draggable>
      <div class="bottom-new">
        <m-button @click="newQuestion" unelevated>
          <m-icon slot="icon" icon="add" />
          {{$t('plugin.ess.editor.new')}}
        </m-button>
      </div>
    </div>
    <div v-else-if="questionLoadError">{{$t('plugin.ess.editor.questionLoadError')}}</div>
    <div v-else>{{$t('plugin.ess.editor.questionLoading')}}</div>
  </main>
</template>

<style lang="scss">
@import './styles.scss';
@import 'material-components-vue/components/button/styles';
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
import MButton from 'material-components-vue/components/button/'
import MIcon from 'material-components-vue/components/icon/'
import Question from './components/Question'
import hooks from './hooks'
import { query } from '../common/graphql'
import draggable from 'vuedraggable'
import saveStateRelay from './components/saveStateRelay'
import saveStateDisplay from './components/saveStateDisplay'
import questionsNeeded from './questionsNeeded'

Vue.use(MButton)
Vue.use(MIcon)

export default {
  name: 'Editor',
  mixins: [ saveStateRelay, saveStateDisplay, questionsNeeded ],
  components: {
    Question,
    draggable,
  },
  data () {
    return {
      newQuestionDialogOpen: false,
      dragging: false,
    }
  },
  methods: {
    async newQuestion () {
      try {
        const res = await query(`
          mutation NewQuestion($pageId: Int!, $options: QuestionInput!) {
            newQuestion(pageId: $pageId, options: $options)
          }`.trim(), {
          pageId: this.currentPageId,
          options: this.$t('plugin.ess.question.default'),
        })
        if (res.errors) {
          throw res
        } else {
          this.questions.push(Object.assign({ id: res.data.newQuestion }, this.$t('plugin.ess.question.default')))
          this.$nextTick(() => window.scrollTo(0, 1048576))
        }
      } catch (e) {
        // TODO: replace this hint
        alert('我们遇到了一个错误……')
        console.error(e)
      }
    },
    async update () {
      return await Promise.all(this.questions.map((_, i) => this.$refs[`question-${i}`][0].update()))
    },
    remove (i) {
      this.questions.splice(i, 1)
    },
    move (item) {
      this.dragging = false
      const q = this.$refs[`question-${item.newIndex}`][0]
      q.$emit('reorder', item.newIndex - item.oldIndex)
    },
  },
  mounted () {
    hooks.emit('editor:editorMounted', [ this ])
    this.loadQuestions()
  },
}
</script>
