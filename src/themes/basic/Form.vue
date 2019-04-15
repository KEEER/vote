<template>
  <main>
    <slot />
  </main>
</template>

<script>
  // import Vue from 'vue'
  import Question from './Question'
  import Page from './Page'

  // TODO: Pagination

  export default Vue.extend({
    data: function() {
      return {}
    },
    methods: {},
    components: {
      Question,
      Page,
    },
  })
  export {Question}
</script>
