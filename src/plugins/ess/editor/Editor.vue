<template>
  <main id="editor">
    <m-button id="new-question" @click="newQuestion" unelevated>{{texts.new}}</m-button>
  </main>
</template>

<style lang="scss">
@import './styles.scss';
@import 'material-components-vue/dist/button/styles';

main {
  padding: 10px;
}

#new-question {
  float: right;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button'
import hooks from './hooks'
import {query} from '../common/graphql'

Vue.use(MButton)

export default {
  name: 'Editor',
  data() {
    return {
      texts: {
        new: 'Add question',
      },
      pageId: 0,
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
