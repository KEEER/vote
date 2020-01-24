<template>
  <main>
    <h1>{{this.title}}</h1>
    <slot v-if="!submitting && !submitted && !submiterror" />
    <span v-if="!submitting && !submitted && !submiterror" class="form-controls">
      {{texts.pageno}}
      <button class="form-prev" :hidden="!prevVisible" @click="prev">{{texts.prevPage}}</button>
      <button class="form-next" :hidden="!nextVisible" @click="next">{{texts.nextPage}}</button>
      <button class="form-submit" :hidden="nextVisible" @click="submit">{{texts.submit}}</button>
    </span>
    <h1 v-if="submitting && !submitted">{{texts.submitting}}</h1>
    <h1 v-if="submitted">{{texts.submitted}}</h1>
    <h1 v-if="submiterror">{{texts.submiterror}}</h1>
  </main>
</template>

<script>
// import Vue from 'vue'
import Question from './Question'
import Page from './Page'
import hooks from './hooks'
import 'array-flat-polyfill' // MicroMsg doesn't support that

export default Vue.extend({
  data: function () {
    return {
      current: 0,
      prevVisible: false,
      nextVisible: false,
      status: 'filling',
      texts: {
        prevPage: '←Prev page',
        nextPage: 'Next page→',
        submit: 'Submit',
        page: form => `Page ${form.current + 1}`,
        pageno: null,
        submitting: 'Submitting...',
        submitted: 'The form has been submitted. Thank you.',
        submiterror: 'There is an error submitting the form.',
      },
    }
  },
  props: {
    title: String,
    action: String,
    method: String,
  },
  methods: {
    prev () {
      if (this.current === 0) return
      this.$children[this.current].current = false
      this.current--
      this.$children[this.current].current = true
      this.update()
    },
    next () {
      if (this.current === this.pages.length - 1) return
      this.$children[this.current].current = false
      this.current++
      this.$children[this.current].current = true
      this.update()
    },
    update () {
      this.updateVisibility()
      hooks.emit('form:update', [ this ])
    },
    updateVisibility () {
      if (this.current === 0) this.prevVisible = false
      else this.prevVisible = true
      if (this.current === this.pages.length - 1) this.nextVisible = false
      else this.nextVisible = true
      this.texts.pageno = this.texts.page(this)
      hooks.emit('form:updatevisibility', [ this ])
    },
    submit () {
      let cancel = false
      hooks.emit('form:beforesubmit', [ this, () => cancel = true ])
      if (!cancel) {
        hooks.emit('form:submit', [ this ])
      }
    },
  },
  components: {},
  mounted () {
    document.title = this.title
    this.$children[this.current].current = true
    this.updateVisibility()
    this.texts.pageno = this.texts.page(this)
    hooks.emit('form:mounted', [ this ])
    hooks.emit('form:updatevisibility', [ this ])
  },
  computed: {
    pages () {
      return this.$children
    },
    currentPage () {
      let page = this.current + 1
      hooks.emit('form:pageno', [ this, p => page = p ])
      return page
    },
    submitted () {
      return this.status === 'submitted'
    },
    submitting () {
      return this.status === 'submitting'
    },
    submiterror () {
      return this.status === 'submiterror'
    },
    formdata () {
      const data = []
      this.pages.flatMap(page => page.questions).forEach(q => {
        data[q.id] = q.value
      })
      return data
    },
    valid () {
      let validity = this.pages.every(p => p.valid)
      hooks.emit('form:validate', [ this, v => validity = v ])
      return validity
    },
  },
})
export {
  Question,
  Page,
}
</script>
