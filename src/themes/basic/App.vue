<template>
  <Form>
    <Page>
      <Question type="VRadio" value="1" :data="{title: 'a', options:[{value:'1',label:'a'},{value:'2',label:'b'}]}"></Question>
    </Page>
    <Page></Page>
  </Form>
</template>

<script>
  // import Vue from 'vue'
  import Form, {Question, Page} from './Form'
  import hooks from './hooks'

  hooks.on('form-update', form => form.pages[0].questions[0].value = '2')

  export default {
    components: {
      Form,
      Question,
      Page,
    }
  }
</script>
