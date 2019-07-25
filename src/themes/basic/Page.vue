<template>
  <div :class="this.current ? 'page current' : 'page'">
    <slot />
  </div>
</template>

<style scoped>
.page {
  display: none;
}
.page.current {
  display: block;
}
</style>

<script>
import hooks from './hooks'
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
      let validity = this.questions.every(q => q.valid)
      hooks.emit('page:validate', [this, v => validity = v])
      return validity
    },
  },
}
</script>
