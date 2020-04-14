<template>
  <main :style="`color:${color};`">
    <h1>{{this.title}}</h1>
    <slot v-if="!submitting && !submitted && !submiterror" />
    <span v-if="!submitting && !submitted && !submiterror" class="form-controls">
      {{$t('theme.common.page', { page: current + 1 })}}
      <button class="form-prev" :hidden="!prevVisible" @click="prev">{{$t('theme.common.prevPage')}}</button>
      <button class="form-next" :hidden="!nextVisible" @click="next">{{$t('theme.common.nextPage')}}</button>
      <button class="form-submit" :hidden="nextVisible" @click="submit">{{$t('theme.common.submit')}}</button>
    </span>
    <h1 v-if="submitting && !submitted">{{$t('theme.common.submitting')}}</h1>
    <h1 v-if="submitted">{{$t('theme.common.submitted')}}</h1>
    <h1 v-if="submiterror">{{$t('theme.common.submiterror')}}</h1>
  </main>
</template>

<script>
import Question from './Question'
import Page from './Page'
import hooks from './hooks'
import 'array-flat-polyfill' // MicroMsg doesn't support that
import { types } from './types'

export default Vue.extend({
  data: function () {
    return {
      current: 0,
      prevVisible: false,
      nextVisible: false,
      status: 'filling',
      types,
      color: '#000000',
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
      hooks.emit('form:update', this)
    },
    updateVisibility () {
      this.prevVisible = this.current !== 0;
      this.nextVisible = this.current !== this.pages.length - 1;
      hooks.emit('form:updateVisibility', this)
    },
    submit () {
      let cancel = false
      hooks.emit('form:beforeSubmit', { form: this, cancel: () => cancel = true })
      if (!cancel) {
        hooks.emit('form:submit', this)
      }
    },
  },
  components: {},
  mounted () {
    document.title = this.title
    this.$children[this.current].current = true
    this.updateVisibility()
    hooks.emit('form:mounted', this)
    hooks.emit('form:updateVisibility', this)
    if (window.KVoteFormData.config && window.KVoteFormData.config.settings && window.KVoteFormData.config.settings['theme-basic.color']) {
      this.color = window.KVoteFormData.config.settings['theme-basic.color'].replace(/;/g, '').replace(/ /g, '')
    }
  },
  computed: {
    pages () {
      return this.$children
    },
    currentPage () {
      let page = this.current + 1
      hooks.emit('form:pageNo', { form: this, set: p => page = p })
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
      hooks.emit('form:validate', { form: this, invalidate: () => validity = false })
      return validity
    },
  },
})
export {
  Question,
  Page,
}
</script>
