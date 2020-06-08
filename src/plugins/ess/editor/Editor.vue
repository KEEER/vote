<template>
  <main id="editor">
    <DataNavigator
      v-if="!exitSaveError && !questionLoadError"
      count-label="plugin.ess.editor.pageCount"
      null-label="plugin.ess.editor.questionLoading"
      :count="pageCount"
      :current.sync="currentPageId"
      :before-update="update"
      allow-add
      @add="addPage"
    >
      <m-list slot="menu">
        <m-list-item @click="questions.forEach((_, i) => $refs[`question-${i}`][0].fold())">
          <m-icon slot="graphic" icon="keyboard_arrow_up" class="menu-icon" />
          <template slot="text" v-text="$t('plugin.ess.editor.foldAll')" />
        </m-list-item>
        <m-list-item @click="questions.forEach((_, i) => $refs[`question-${i}`][0].unfold())">
          <m-icon slot="graphic" icon="keyboard_arrow_down" class="menu-icon" />
          <template slot="text" v-text="$t('plugin.ess.editor.unfoldAll')" />
        </m-list-item>
      </m-list>
    </DataNavigator>
    <div v-if="exitSaveError" v-text="$t('plugin.ess.editor.exitSaveError')" />
    <div v-else-if="exiting" v-text="$t('plugin.ess.editor.exiting')" />
    <div v-else-if="questionLoaded" id="questions">
      <draggable
        v-model="questions"
        :animation="200"
        handle=".handle"
        ghost-class="ghost"
        @start="dragging = true"
        @end="move"
      >
        <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
          <Question
            v-for="(question, i) in questions"
            :key="question.id"
            :ref="`question-${i}`"
            route="editor"
            :data="question"
            @update:data="updateData"
            @remove="remove(i)"
            @update:saveState="updateSaveState"
          />
        </transition-group>
      </draggable>
      <div class="bottom-new">
        <m-button unelevated @click="newQuestion">
          <m-icon slot="icon" icon="add" />
          {{ $t('plugin.ess.editor.new') }}
        </m-button>
      </div>
    </div>
    <div v-else-if="questionLoadError" v-text="$t('plugin.ess.editor.questionLoadError')" />
    <div v-else v-text="$t('plugin.ess.editor.questionLoading')" />
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

.mdc-menu .mdc-list .menu-icon {
  color: rgba(0, 0, 0, 0.6);
  margin-right: 12px;
}
</style>

<script>
import draggable from 'vuedraggable'
import { query } from '../common/graphql'
import Question from './components/Question'
import hooks from './hooks'
import saveStateRelay from './components/saveStateRelay'
import saveStateDisplay from './components/saveStateDisplay'
import questionsNeeded from './questionsNeeded'
import DataNavigator from './components/DataNavigator.vue'

export default {
  name: 'Editor',
  components: {
    Question,
    draggable,
    DataNavigator,
  },
  mixins: [ saveStateRelay, saveStateDisplay, questionsNeeded ],
  data () {
    return {
      newQuestionDialogOpen: false,
      dragging: false,
    }
  },
  watch: {
    currentPageId () { this.processPages() },
  },
  mounted () {
    /**
     * Editor component mounted event.
     * @event editor.editor:editorMounted
     * @type {editor:Editor}
     */
    hooks.emit('editor:editorMounted', this)
    this.loadQuestions()
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
      /**
       * Question reorder event, payload is reorder count.
       * @event editor:Question#reorder
       * @type {number}
       */
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
}
</script>
