<template>
  <div :class="this.current ? 'page current' : 'page'">
    <slot />
  </div>
</template>

<style>
.page {
  display: none;
}
.page.current {
  display: block;
}
</style>

<script>
export default {
  name: 'Page',
  data() {
    return {
      current: false,
    }
  },
  computed: {
    questions() {
      return this.$children
    },
    valid() {
      return this.questions.every(q => q.valid)
    },
  },
}
</script>
