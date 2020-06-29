<template>
  <div>
    <m-list v-if="questions !== null" v-model="selectedIndex" :role="multiple ? 'group' : 'radiogroup'">
      <m-list-item v-for="(q, i) in questions" :key="q.id" aria-checked="false" :role="multiple ? 'checkbox' : 'radio'">
        <m-checkbox v-if="multiple" :id="`qp-${uid}-${i}`" slot="meta" :name="`qp-${uid}`" value="1" />
        <m-radio v-else :id="`qp-${uid}-${i}`" slot="meta" :name="`qp-${uid}`" value="1" />
        <label :for="`qp-${uid}-${i}`" v-text="q.title" />
      </m-list-item>
    </m-list>
    <m-typo-body v-else :level="1" v-text="$t('core.question.picker.notAvailable')" />
  </div>
</template>

<script>
export default {
  name: 'QuestionPicker',
  inject: [ 'questionsInstance' ],
  props: {
    multiple: Boolean,
    value: {
      type: [ Number, Array ],
      default () { this.multiple ? [] : -1 },
    },
  },
  data () {
    return {
      selectedIndex: multiple ? [] : -1,
      selectedIds: this.value,
    }
  },
  computed: {
    questions () {
      if (!this.questionInstance) return null
      if (!this.questionInstance.questionLoaded) return []
      if (this.questionInstance.questionLoadError) return null
      return this.questionInstance.questions
    },
  },
  watch: {
    selectedIndex () {
      this.syncIndexToQuestions()
      this.$emit('input', this.selectedIds)
    },
    questions () { this.syncQuestionsToIndex() },
    value (val) { this.selectedIds = val },
  },
  mounted () { this.syncQuestionsToIndex() },
  methods: {
    syncIndexToQuestions () {
      if (!this.questions) return
      if (this.multiple) {
        this.selectedIds = this.selectedIndex.map(i => this.questions[i]).filter(x => !!x)
      } else {
        this.selectedIds = this.questions[this.selectedIndex] || -1
      }
    },
    syncQuestionsToIndex () {
      if (!this.questions) return
      if (this.multiple) {
        this.selectedIndex = this.selectedIds.map(x => this.questions.findIndex(q => q.id === x)).filter(x => x > -1)
      } else {
        this.selectedIndex = this.questions.findIndex(q => this.selectedIds === q.id)
      }
    },
  },
}
</script>
