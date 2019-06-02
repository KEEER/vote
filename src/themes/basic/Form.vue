<template>
  <main>
    <h1>{{this.title}}</h1>
    <slot v-if="!submitting && !submitted" />
    <span v-if="!submitting && !submitted" class="form-controls">
      {{texts.pageno}}
      <button class="form-prev" :hidden="!prevVisible" @click="prev">{{texts.prevPage}}</button>
      <button class="form-next" :hidden="!nextVisible" @click="next">{{texts.nextPage}}</button>
      <button class="form-submit" :hidden="nextVisible" @click="submit">{{texts.submit}}</button>
    </span>
    <h1 v-if="submitting && !submitted">{{texts.submitting}}</h1>
    <h1 v-if="submitted">{{texts.submitted}}</h1>
  </main>
</template>

<script>
// import Vue from 'vue'
import Question from './Question'
import Page from './Page'
import hooks from './hooks'
import 'array-flat-polyfill' // MicroMsg doesn't support that

export default Vue.extend({
  data: function() {
    return {
      current: 0,
      prevVisible: false,
      nextVisible: false,
      status: 'filling',
    }
  },
  props: {
    title: String,
    action: String,
    method: String,
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
      hooks.emit('form:update', this)
    },
    updateVisibility() {
      if(this.current === 0) this.prevVisible = false
      else this.prevVisible = true
      if(this.current === this.pages.length - 1) this.nextVisible = false
      else this.nextVisible = true
    },
    submit() {
      let cancel = false
      hooks.emit('form:beforesubmit', this, () => cancel = true)
      if(!cancel) {
        hooks.emit('form:submit', this)
      }
    },
  },
  components: {},
  mounted() {
    this.$children[this.current].current = true
    this.updateVisibility()
    hooks.emit('form:mounted', this)
  },
  computed: {
    pages() {
      return this.$children
    },
    texts() {
      let texts = {
        prevPage: '←Prev page',
        nextPage: 'Next page→',
        submit: 'Submit',
        pageno: `Page ${this.current + 1}`,
        submitting: 'Submitting...',
        submitted: 'The form has been submitted. Thank you.',
      }
      hooks.emit('form:texts', this, t => texts = Object.assign(texts, t))
      return texts
    },
    currentPage() {
      let page = this.current + 1
      hooks.emit('form:pageno', this, p => page = p)
      return page
    },
    submitted() {
      return this.status === 'submitted'
    },
    submitting() {
      return this.status === 'submitting'
    },
    formdata() {
      const data = []
      this.pages.flatMap(page => page.questions).forEach(q => {
        data[q.id] = q.value
      })
      return data
    },
  },
})
export {
  Question,
  Page,
}
</script>
