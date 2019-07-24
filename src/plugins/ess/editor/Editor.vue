<template>
  <main id="editor">
    <m-button id="new-question" @click="newQuestionDialogOpen = true" unelevated>{{texts.new}}</m-button>
    <m-dialog id="new-question-dialog" v-model="newQuestionDialogOpen" scrollable>
      <m-typo-headline :level="5" slot="header">{{texts.new}}</m-typo-headline>
      <m-typo-body :level="1" slot="body">
        <m-select id="new-question-type" required outlined enhanced v-model="newQuestionType">
          <m-list-item v-for="(name, value) in questionTypes" :key="value" :data-value="value" aria-selected="false">
            {{name}}
          </m-list-item>
          <m-floating-label for="new-question-type" id="new-question-type-label" slot="label">
            {{texts.selectQuestionType}}
          </m-floating-label>
        </m-select>
      </m-typo-body>
      <m-button
        class="mdc-dialog__button"
        data-mdc-dialog-action="Cancel"
        slot="cancelButton">
        {{texts.cancel}}
      </m-button>
      <m-button unelevated
        class="mdc-dialog__button"
        data-mdc-dialog-action="OK"
        slot="acceptButton"
        @click="newQuestion">
        {{texts.ok}}
      </m-button>
    </m-dialog>
  </main>
</template>

<style lang="scss">
@import './styles.scss';
@import 'material-components-vue/dist/button/styles';
@import 'material-components-vue/dist/dialog/styles';
@import 'material-components-vue/dist/typography/styles';
@import 'material-components-vue/dist/select/styles';
@import 'material-components-vue/dist/floating-label/styles';
@import 'material-components-vue/dist/list/styles';

main {
  padding: 10px;
}

#new-question {
  float: right;
}

m-select {
  margin-top: 8px;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button'
import MDialog from 'material-components-vue/dist/dialog'
import MTypo from 'material-components-vue/dist/typography'
import MSelect from 'material-components-vue/dist/select'
import MFloatingLabel from 'material-components-vue/dist/floating-label'
import MList from 'material-components-vue/dist/list'
import hooks from './hooks'
import {types as questionTypes} from '../../../question'
import {query} from '../common/graphql'

;[
  MButton,
  MDialog,
  MTypo,
  MSelect,
  MFloatingLabel,
  MList,
].forEach(component => Vue.use(component))

export default {
  name: 'Editor',
  data() {
    return {
      texts: {
        new: 'Add question',
        cancel: 'Cancel',
        ok: 'OK',
        selectQuestionType: 'Question Type',
      },
      newQuestionDialogOpen: false,
      newQuestionType: null,
      pageId: 0,
      questionTypes,
    }
  },
  methods: {
    async newQuestion() {
      try {
        // TODO: ask user for these params
        const res = await query(`
          mutation NewQuestion($pageId: Int!, $options: QuestionInput!) {
            newQuestion(pageId: $pageId, options: $options)
          }`, {
          pageId: this.pageId,
          options: {
            type: 'VText',
            title: 'Title',
            id: 1,
          },
        })
        if(res.errors || !res.data.addQuestion) {
          alert('我们遇到了一个错误……')
          console.error(res)
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
