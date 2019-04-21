<template>
  <main>
    <slot />
    <span class="form-controls">
      <button class="form-prev" :hidden="!prevVisible" @click="prev">←Prev page</button>
      <button class="form-next" :hidden="!nextVisible" @click="next">Next page→</button>
      <button class="form-submit" :hidden="nextVisible" @click="submit">Submit</button>
    </span>
  </main>
</template>

<script>
  // import Vue from 'vue'
  import Question from './Question'
  import Page from './Page'
  import hooks from './hooks'

  // TODO: Pagination

  export default Vue.extend({
    data: function() {
      return {
        current: 0,
        prevVisible: false,
        nextVisible: false,
      }
    },
    methods: {
      prev() {
        if(this.current === 0) return
        this.$children[this.current].current = false
        this.current--
        this.$children[this.current].current = true
        this.update()
      },
      next() {
        if(this.current === this.pages.length - 1) return
        this.$children[this.current].current = false
        this.current++
        this.$children[this.current].current = true
        this.update()
      },
      update() {
        this.updateVisibility()
        hooks.emit('form-update', this)
      },
      updateVisibility() {
        if(this.current === 0) this.prevVisible = false
        else this.prevVisible = true
        if(this.current === this.pages.length - 1) this.nextVisible = false
        else this.nextVisible = true
      },
      submit() {
        // TODO: submit
      },
    },
    components: {
      Question,
      Page,
    },
    mounted() {
      this.$children[this.current].current = true
      this.updateVisibility()
      hooks.emit('form-mounted', this)
    },
    computed: {
      pages() {
        return this.$children
      }
    },
  })
  export {
    Question,
    Page,
  }
</script>
