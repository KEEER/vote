<template>
  <m-card
    class="form"
    :class="{ 'form__top': onTop, 'form__bottom': onBottom, 'form__no-transition': noTransition }"
    :style="`background-color: ${this.colors.bgColor || 'white'}; color: ${this.colors.textColor || 'black'};`"
  >
    <m-typo-headline
      :level="6"
      class="form__title--scroll mdc-elevation--z3"
      :class="{ 'form__title--scroll--show': showScrollTitle }"
      :style="`background-color: ${this.colors.bgColor || 'white'};`"
    >{{this.title}}</m-typo-headline>
    <div class="content">
      <m-typo-headline :level="3" class="form__title">{{this.title}}</m-typo-headline>
      <div class="divider"></div>
      <template v-if="!submitting && !submitted && !submiterror">
        <m-button class="form-prev" :hidden="!prevVisible" @click="prev">{{$t('theme.common.prevPage')}}</m-button>
        <Page v-for="(page, i) in data.data" :page="page" :key="i" ref="pages" />
        <div class="form-footer">
          <span class="form-controls">
            <m-button class="form-prev" :hidden="!prevVisible" @click="prev">{{$t('theme.common.prevPage')}}</m-button>
            <span v-if="data.data.length > 1">{{$t('theme.common.page', { page: current + 1 })}}</span>
            <m-button unelevated class="form-next" :hidden="!nextVisible" @click="next">{{$t('theme.common.nextPage')}}</m-button>
            <m-button unelevated class="form-submit" :hidden="nextVisible" @click="submit">{{$t('theme.common.submit')}}</m-button>
          </span>
          <a class="footer-link" href="/?utm_source=form&utm_medium=footer">
            <img class="vote-icon" src="/img/logo.svg" />
            {{$t('theme.default.footer')}}
          </a>
        </div>
      </template>
      <m-typo-headline class="status" :level="5" v-if="showSubmitting">{{$t('theme.common.submitting')}}</m-typo-headline>
      <m-typo-headline class="status" :level="5" v-if="showSubmitted">{{$t('theme.common.submitted')}}</m-typo-headline>
      <m-typo-headline class="status" :level="5" v-if="showSubmiterror">{{$t('theme.common.submiterror')}}</m-typo-headline>
    </div>
  </m-card>
</template>

<style scoped>
[hidden] { display: none; }
.form, .form__title--scroll {
  max-width: 720px;
  margin: 0 auto;
  display: block;
  overflow: hidden;
  position: relative;
  transition: all 250ms cubic-bezier(.4, 0, .2, 1);
}
.form {
  width: 100%;
  top: 0;
  overflow-wrap: break-word;
}
.form.form__top {
  top: calc(-100% - 400px);
}
.form.form__bottom {
  top: calc(100% + 400px);
}
.form.form__no-transition {
  transition: none;
  opacity: 0;
}
.content {
  padding: 16px;
}
.form__title {
  margin: 16px 0;
  display: block;
}
.form__title--scroll {
  position: absolute;
  z-index: 8;
  left: 0;
  right: 0;
  box-sizing: border-box;
  height: 64px;
  padding: 16px;
  line-height: 32px;
  transition: top 200ms cubic-bezier(.4, 0, .2, 1);
  background: white;
  top: -70px;
}
@media (max-width: 599px) {
  .form__title--scroll {
    height: 56px;
    line-height: 24px;
    top: -64px;
  }
}
.form__title--scroll.form__title--scroll--show {
  position: fixed;
  top: 0;
  left: 16px;
  right: 16px;
}
.divider {
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  width: 100%;
}
.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.form-controls {
  display: flex;
  align-items: center;
}
.form-controls > * {
  margin: 0 8px;
}
.footer-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
}
.vote-icon {
  width: 45px;
  height: 45px;
  margin-right: 4px;
}
.footer-link:hover, .footer-link:active, .footer-link:focus {
  text-decoration: underline;
}
.status {
  margin: 16px 0;
  display: block;
}
</style>

<style>
body.locked { overflow: hidden; }
</style>

<script>
import Page from './Page'
import hooks from './hooks'
import 'array-flat-polyfill'
import { types } from './types'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  data: function () {
    return {
      current: 0,
      prevVisible: false,
      nextVisible: false,
      status: 'filling',
      showScrollTitle: false,
      types,
      onTop: false,
      onBottom: false,
      noTransition: false,
      showSubmitting: false,
      showSubmitted: false,
      showSubmiterror: false,
      inAnimation: false,
    }
  },
  inject: [ 'data', 'colors' ],
  components: { Page },
  props: {
    title: String,
    action: String,
    method: String,
  },
  watch: {
    status (val) {
      if (val === 'submitting') this.showSubmitting = true
      if (val === 'submitted' || val === 'submiterror') {
        const next = () => {
          this.showSubmitting = false
          this[val === 'submitted' ? 'showSubmitted' : 'showSubmiterror'] = true
        }
        if (this.inAnimation) next()
        else this.flipPage(val === 'submitted' ? 'up' : 'down', next)
      }
    },
  },
  methods: {
    async flipPage (dir, cb) {
      this.inAnimation = true
      const name1 = dir === 'down' ? 'onBottom' : 'onTop'
      const name2 = dir === 'down' ? 'onTop' : 'onBottom'
      document.body.classList.add('locked')
      this[name1] = true
      this.clearInterval()
      this.showScrollTitle = false
      await delay(250)
      this.noTransition = true
      this[name2] = true
      this[name1] = false
      window.scrollTo(0, 0)
      if (!cb || await cb() !== 'reverse') {
        await delay(100)
        this.noTransition = false
        this[name2] = false
      }
      await delay(250)
      this.setInterval()
      document.body.classList.remove('locked')
      this.inAnimation = false
    },
    async prev () {
      if (this.current === 0) return
      await this.flipPage('down', () => {
        this.pages[this.current].current = false
        this.current--
        this.pages[this.current].current = true
        this.update()
      })
    },
    async next () {
      if (this.current === this.pages.length - 1) return
      if (!this.pages[this.current].valid) return this.pages[this.current].$emit('validateNext')
      await this.flipPage('up', () => {
        this.pages[this.current].current = false
        this.current++
        this.pages[this.current].current = true
        this.update()
      })
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
      hooks.emit('form:updatevisibility', [ this ])
    },
    async submit () {
      if (!this.pages[this.current].valid) return this.pages[this.current].$emit('validateNext')
      let cancel = false
      hooks.emit('form:beforesubmit', [ this, () => cancel = true ])
      if (!cancel) {
        await this.flipPage('up', () => hooks.emit('form:submit', [ this ]))
      }
    },
    setInterval () {
      this.intervalId = setInterval(() => {
        if (window.scrollY > 200) {
          if (!this.showScrollTitle) this.showScrollTitle = true
        } else {
          if (this.showScrollTitle) this.showScrollTitle = false
        }
      }, 40)
    },
    clearInterval () {
      clearInterval(this.intervalId)
      this.intervalId = null
    },
  },
  mounted () {
    document.title = this.title
    this.pages[this.current].current = true
    this.updateVisibility()
    hooks.emit('form:mounted', [ this ])
    hooks.emit('form:updatevisibility', [ this ])
    if (window.KVoteFormData.config && window.KVoteFormData.config.settings && window.KVoteFormData.config.settings['theme-basic.color']) {
      this.color = window.KVoteFormData.config.settings['theme-basic.color'].replace(/;/g, '').replace(/ /g, '')
    }
    this.setInterval()
  },
  computed: {
    pages () {
      return this.$refs.pages
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
      hooks.emit('form:validate', [ this, () => validity = false ])
      return validity
    },
  },
}
</script>
