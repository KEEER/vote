<template>
  <Form>
    <Question type="Radio" :data="{title: 'a', value: '2', options:[{value:'1',label:'a'},{value:'2',label:'b'}]}"></Question>
    <Question type="Checkbox" :data="{title: 'b', value: {1: true, 2: false}, options:[{value:'1',label:'a'},{value:'2',label:'b'}]}"></Question>
    <Question type="Textinput" :data="{title: 'c', value: 'b'}"></Question>
  </Form>
</template>

<script>
  // import Vue from 'vue'
  import Form, {Question} from './Form'
  export default {
    components: {
      Form,
      Question,
    }
  }
</script>
