<template>
  <Form>
    <Question type="Radio" :data="{title: 'a', options:[{value:'1',label:'a'},{value:'2',label:'b'}]}"></Question>
    <Question type="Radio" :data="{title: 'b', options:[{value:'1',label:'a'},{value:'2',label:'b'}]}"></Question>
  </Form>
</template>

<script>
  import Vue from 'vue'
  import Form, {Question} from './Form'
  export default {
    components: {
      Form,
      Question
    }
  }
</script>
