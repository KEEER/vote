<template>
  <main>
    <slot />
  </main>
</template>

<script>
  import Vue from 'vue'
  import Question from './Question'

  export default Vue.extend({
    data: function() {
      return {}
    },
    methods: {},
    components: {
      Question
    },
  })
  export {Question}
</script>
