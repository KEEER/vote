<template>
  <main id="editor">
    <DataNavigator
      count-label="plugin.ess.editor.pageCount"
      null-label="plugin.ess.editor.questionLoading"
      :count="pageCount"
      :current.sync="currentPageId"
      :before-update="update"
      v-if="!exitSaveError && !questionLoadError"
      allowAdd
      @add="addPage"
    />
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
            @update:data="updateData"
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
import Question from './components/Question'
import hooks from './hooks'
import { query } from '../common/graphql'
import draggable from 'vuedraggable'
import saveStateRelay from './components/saveStateRelay'
import saveStateDisplay from './components/saveStateDisplay'
import questionsNeeded from './questionsNeeded'
import DataNavigator from './components/DataNavigator.vue'

export default {
  name: 'Editor',
  mixins: [ saveStateRelay, saveStateDisplay, questionsNeeded ],
  components: {
    Question,
    draggable,
    DataNavigator,
  },
  data () {
    return {
      newQuestionDialogOpen: false,
      dragging: false,
    }
  },
  watch: {
    currentPageId () { this.processPages() },
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
      this.processPages()
    },
    move (item) {
      this.dragging = false
      const q = this.$refs[`question-${item.newIndex}`][0]
      q.$emit('reorder', item.newIndex - item.oldIndex)
    },
    updateData (val) {
      const i = this.questions.findIndex(q => q.id === val.id)
      this.questions[i] = this.pages[this.currentPageId][i] = val
    },
    async addPage () {
      await this.update()
      this.currentPageId = this.pageCount++
    },
    /**
     * WARNING: DO NOT MODIFY this function unless you FULLY understand how it works and know EVERY EDGE CASE
     * update pages to be consistent with server-side (see Form.processPages)
     * TODO: unit test
     */
    processPages () {
      this.$nextTick(() => {
        for (let i = 0; i < this.pageCount; i++) {
          // loaded, blank and non-current page: filter them out
          if (i in this.pages && i !== this.currentPageId && this.pages[i].length === 0) {
            const pages = this.pages.slice(0, i)
            for (let j = i + 1; j < this.pages.length; j++) if (j in this.pages) pages[j - 1] = this.pages[j]
            this.pages = pages
            this.pageCount--
            if (this.currentPageId > i) this.currentPageId--
            if (this.currentPageId >= this.pageCount) this.currentPageId = this.pageCount - 1
          }
        }
      })
    },
  },
  mounted () {
    hooks.emit('editor:editorMounted', [ this ])
    this.loadQuestions()
  },
}
</script>
