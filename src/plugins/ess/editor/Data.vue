<template>
  <main id="data">
    <div v-if="showTags" class="search-tags">
      <m-chip-set input class="tags">
        <m-chip v-for="tag in searchTags" :key="tag" @removal="searchTags = searchTags.filter(t => t !== tag)">
          {{ tag }} <m-icon icon="cancel" slot="trailingIcon" />
        </m-chip>
        <m-text-field
          full-width
          class="tags__input"
          v-model="searchTagName"
          :placeholder="$t('plugin.ess.data.searchTagsPlaceholder')"
          @keydown="handleSearchKeydown"
          maxlen="64"
        >
          <m-line-ripple slot="bottomLine" />
        </m-text-field>
        <m-chip @interaction="loadSubmissionIds">
          <m-icon icon="search" slot="leadingIcon" />
          {{ $t('plugin.ess.data.searchTags') }}
        </m-chip>
      </m-chip-set>
    </div>
    <DataNavigator
      count-label="plugin.ess.data.submissionCount"
      null-label="plugin.ess.data.noSubmissions"
      :count="submissionIds.length"
      :current.sync="currentSubmissionIndex"
      v-if="loaded"
    >
      <m-list slot="menu">
        <m-list-item @click="exportData">
          <m-icon icon="get_app" class="menu-icon" slot="graphic" />
          <template slot="text">{{ $t('plugin.ess.data.export') }}</template>
        </m-list-item>
      </m-list>
    </DataNavigator>
    <div id="response" v-if="loaded && currentSubmission && !submissionLoading">
      <div class="submission-meta">
        <p class="submission-id">{{ $t('plugin.ess.data.submissionId') }}{{ currentSubmissionId }}</p>
        <p class="submission-time">{{ $t('plugin.ess.data.submissionTime') }}{{ currentSubmission.time.toLocaleString() }}</p>
        <div v-if="showTags" class="submission-tags">
          <m-chip-set input class="tags">
            <m-chip
              v-for="tag in currentSubmission.tags"
              :key="tag"
              @removal="currentSubmission.tags = currentSubmission.tags.filter(t => t !== tag)"
            >
              {{ tag }}
              <m-icon v-show="editingTag" icon="cancel" slot="trailingIcon" />
            </m-chip>
            <m-text-field
              full-width
              class="tags__input"
              ref="tagInput"
              v-if="editingTag"
              v-model="tagName"
              :placeholder="$t('plugin.ess.data.editTagPlaceholder')"
              @keydown="handleKeydown"
              maxlen="64"
            >
              <m-line-ripple slot="bottomLine" />
            </m-text-field>
            <m-chip @interaction="toggleEdit">
              <m-icon :icon="editingTag ? 'done' : 'edit'" slot="leadingIcon" />
              {{ $t(editingTag ? 'plugin.ess.data.finishTags' : 'plugin.ess.data.manageTags') }}
            </m-chip>
          </m-chip-set>
        </div>
      </div>
      <DataNavigator
        count-label="plugin.ess.editor.pageCount"
        null-label="plugin.ess.editor.questionLoading"
        :count="pageCount"
        :current.sync="currentPageId"
      />
      <Question
        v-for="question in questions"
        route="data"
        :key="question.id"
        :data="{ ...question, value: currentSubmission.data[question.id] }"
      />
    </div>
    <div v-else-if="loadError">{{ $t('plugin.ess.data.loadError') }}</div>
    <div v-else-if="!loaded || submissionLoading">{{ $t('plugin.ess.data.loading') }}</div>
  </main>
</template>

<style scoped>
main {
  padding: 10px;
  overflow: hidden;
  overflow-wrap: break-word;
}
.submission-id, .submission-time {
  text-align: center;
  margin: 0;
}
.submission-meta {
  margin: 8px 0;
}
.tags { align-items: center; }
.tags__input {
  flex: 1;
  min-width: 200px;
}
.search-tags { margin-bottom: 8px; }
.mdc-menu .mdc-list .menu-icon {
  color: #626262;
  margin-right: 12px;
}
</style>

<script>
import { query } from '../common/graphql'
import questionsNeeded from './questionsNeeded'
import hooks from './hooks'
import Question from './components/Question.vue'
import DataNavigator from './components/DataNavigator.vue'
import settingsNeeded from './settingsNeeded'

export default {
  name: 'Data',
  mixins: [ questionsNeeded, settingsNeeded ],
  components: { Question, DataNavigator },
  data () {
    return {
      currentSubmission: null,
      currentSubmissionIndex: -1,
      editingTag: false,
      tagName: '',
      searchTags: [],
      searchTagName: '',
      loaded: false,
      loadError: false,
      submissionLoading: false,
      submissionIds: [],
      submissions: [],
    }
  },
  watch: {
    currentSubmissionIndex () { this.updateSubmissionStatus() },
  },
  computed: {
    currentSubmissionId () {
      return (this.submissionIds || [])[this.currentSubmissionIndex] || null
    },
    showTags () { return this.settingsLoaded && this.settingsData['tags.enabled'] },
  },
  methods: {
    async updateSubmissionStatus () {
      if (this.currentSubmissionIndex === null) return this.currentSubmission = null
      try {
        this.submissionLoading = true
        await this.loadSubmission()
        return this.submissionLoading = false
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async load () {
      try {
        await this.loadSettings()
        await this.loadQuestions()
        await this.loadSubmissionIds()
        return this.loaded = true
      } catch (e) {
        console.log(e)
        return this.loadError = true, false
      }
    },
    async loadSubmissionIds () {
      if (this.searchTagName !== '') this.handleSearchKeydown({ key: 'Enter' })
      const res = await query('query ($tags: [String!]!) { submissionIdsByTag(tags: $tags) }', { tags: this.searchTags })
      if (res.errors) throw res
      this.submissionIds = res.data.submissionIdsByTag
      if (this.submissionIds.length !== 0) this.currentSubmissionIndex = 0
      else this.currentSubmissionIndex = null
    },
    async loadSubmission (id = this.currentSubmissionId) {
      if (!id || id === null) return null
      const inCache = this.submissions.find(s => s.id === id)
      if (inCache) return this.currentSubmission = inCache
      const res = await query('query ($id: String!) { submission(id: $id) { data, tags, time } }', { id })
      if (res.errors) throw res
      const submission = res.data.submission
      submission.time = new Date(Number(submission.time))
      submission.id = id
      submission.data = JSON.parse(submission.data || '{}')
      this.currentSubmission = submission
      this.submissions.push(submission)
      return submission
    },
    handleKeydown (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (!this.currentSubmission.tags.includes(this.tagName) && this.tagName) {
          this.currentSubmission.tags.push(this.tagName)
        }
        this.tagName = ''
      }
    },
    handleSearchKeydown (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (!this.searchTags.includes(this.searchTagName)) {
          this.searchTags.push(this.searchTagName)
        }
        this.searchTagName = ''
      }
    },
    async toggleEdit () {
      if (this.editingTag) {
        this.editingTag = false
        if (this.tagName !== '') this.handleKeydown({ key: 'Enter' })
        try {
          const res = await query(`mutation updateSubmissionTags ($id: String!, $tags: [String!]!) {
            updateSubmissionTags(id: $id, tags: $tags)
          }`, { id: this.currentSubmissionId, tags: this.currentSubmission.tags })
          if (res.errors || !res.data.updateSubmissionTags) throw res
        } catch (e) {
          alert(this.$t('plugin.ess.data.updateTagsError'))
          console.log(e)
        }
      } else {
        this.editingTag = true
        this.$nextTick(() => this.$refs.tagInput.$el.querySelector('input').focus())
      }
    },
    exportData () { window.open('_export', '_blank') },
  },
  mounted () {
    /**
     * Data component mounted event.
     * @event editor.editor:dataMounted
     * @type {editor:Data}
     */
    hooks.emit('editor:dataMounted', this)
    this.load()
  },
}
</script>
