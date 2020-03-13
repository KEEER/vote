<template>
  <div :id="uid"></div>
</template>

<style>
.ce-block .ce-block__content {
  margin: 0;
}
</style>

<script>
; {
  const el = document.createElement('script')
  el.src = 'https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/js/medium-editor.min.js'
  document.head.appendChild(el)
}
for (let css of [
  'https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/css/themes/flat.min.css',
  'https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/css/medium-editor.min.css',
]) {
  const el = document.createElement('link')
  el.href = css
  el.rel = 'stylesheet'
  el.type = 'text/css'
  document.head.appendChild(el)
}

export default {
  name: 'HTMLEditor',
  data () {
    return { editor: null }
  },
  props: {
    data: {},
    readonly: Boolean,
  },
  methods: {
    init () {
      if (this.editor) return
      this.editor = new MediumEditor(this.$el, {
        targerBlank: true,
        placeholder: this.readonly ? false : {
          text: this.$t('plugin.ess.question.description'),
          hideOnClick: true,
        },
      })
      this.editor.setContent((this.data || {}).html || '')
      /**
       * HTML editor content update event.
       * @event editor:HTMLEditor#change
       */
      this.editor.subscribe('editableInput', () => this.$emit('change'))
    },
    destroy () {
      if (!this.editor) return
      this.editor.destroy()
      this.editor = null
    },
    save () { return { html: this.editor.getContent() } },
    freeze () {
      this.destroy()
    },
  },
  mounted () {
    this.init()
    if (this.readonly) {
      this.editor.isReady.then(() => this.freeze())
    }
  },
  beforeDestroy () {
    this.destroy()
  },
}
</script>
