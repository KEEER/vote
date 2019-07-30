<template>
  <main id="editor">
    <m-button id="new-question" @click="newQuestionDialogOpen = true" unelevated>{{texts.new}}</m-button>
    <m-dialog class="new-question-dialog" v-model="newQuestionDialogOpen" scrollable>
      <m-typo-headline :level="5" slot="header">{{texts.new}}</m-typo-headline>
      <m-typo-body :level="1" slot="body">
        <m-select id="new-question-type" class="new-question-dialog-option" required outlined enhanced v-model="newQuestionType">
          <m-list-item v-for="(name, value) in questionTypes" :key="value" :data-value="value" aria-selected="false">
            {{name}}
          </m-list-item>
          <m-floating-label for="new-question-type" id="new-question-type-label" slot="label">
            {{texts.newQuestionType}}
          </m-floating-label>
        </m-select>
        <m-text-field id="new-question-title" class="new-question-dialog-option" outlined required v-model="newQuestionTitle">
          <m-floating-label for="new-question-title">{{texts.newQuestionTitle}}</m-floating-label>
        </m-text-field>
        <m-form-field class="new-question-dialog-option">
          <m-checkbox id="new-question-required" v-model="newQuestionRequired" />
          <label for="new-question-required">Required</label>
        </m-form-field>
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
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/checkbox/styles';
@import 'material-components-vue/dist/floating-label/styles';
@import 'material-components-vue/dist/list/styles';
</style>

<style scoped>
main {
  padding: 10px;
}

#new-question {
  float: right;
}

.new-question-dialog-option {
  display: flex;
  margin-top: 10px;
  align-items: center;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button'
import MDialog from 'material-components-vue/dist/dialog'
import MTypo from 'material-components-vue/dist/typography'
import MSelect from 'material-components-vue/dist/select'
import MTextField from 'material-components-vue/dist/text-field'
import MCheckbox from 'material-components-vue/dist/checkbox'
import MFloatingLabel from 'material-components-vue/dist/floating-label'
import MFormField from 'material-components-vue/dist/form-field'
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
  MFormField,
  MList,
  MTextField,
].forEach(component => Vue.use(component))

export default {
  name: 'Editor',
  data() {
    return {
      texts: {
        new: 'Add question',
        cancel: 'Cancel',
        ok: 'OK',
        newQuestionType: 'Question Type',
        newQuestionTitle: 'Question Title',
      },
      newQuestionDialogOpen: false,
      newQuestionType: null,
      newQuestionTitle: null,
      newQuestionRequired: false,
      currentPageId: 0,
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
          pageId: this.currentPageId,
          options: {
            type: this.newQuestionType,
            title: this.newQuestionTitle,
            required: this.newQuestionRequired,
            // TODO: figure out options for VCheckbox and VRadio
          },
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
