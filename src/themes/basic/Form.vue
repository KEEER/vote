<template>
  <main>
    <h1>{{this.title}}</h1>
    <slot v-if="!submitting" />
    <span v-if="!submitting" class="form-controls">
      <button class="form-prev" :hidden="!prevVisible" @click="prev">←Prev page</button>
      <button class="form-next" :hidden="!nextVisible" @click="next">Next page→</button>
      <button class="form-submit" :hidden="nextVisible" @click="submit">Submit</button>
    </span>
    <h1 v-if="submitting && !submitted">Submitting...</h1>
    <h1 v-if="submitted">The form has been submitted. Thank you.</h1>
  </main>
</template>

<script>
  // import Vue from 'vue'
  import Question from './Question'
  import Page from './Page'
  import hooks from './hooks'

  export default Vue.extend({
    data: function() {
      return {
        current: 0,
        prevVisible: false,
        nextVisible: false,
        submitting: false,
        submitted: false,
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
        hooks.emit('form:submit', this)
        const data = []
        this.pages.map(page => page.questions).flat().forEach(q => {
          data[q.id] = q.value
        })
        const payload = JSON.stringify(data)
        if(this.method !== 'POST') throw new Error('Only POST is supported by now')
        const xhr = new XMLHttpRequest()
        xhr.open('POST', this.action)
        const ctx = this
        xhr.onreadystatechange = function() {
          if(this.readyState !== 4) return
          ctx.submitted = true
          hooks.emit('form:submitted', ctx)
        }
        try {
          xhr.send(payload)
          this.submitting = true
        } catch(e) {
          console.error(e)
          hooks.emit('form:error', e)
        }
      },
    },
    components: {
      Question,
      Page,
    },
    mounted() {
      this.$children[this.current].current = true
      this.updateVisibility()
      hooks.emit('form:mounted', this)
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
