<template>
  <div :id="uid"></div>
</template>

<style>
.ce-block .ce-block__content {
  margin: 0;
}
</style>

<script>
import { injectScript, injectStyle } from '@vote/api'

injectScript('https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/js/medium-editor.min.js')
injectStyle('https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/css/themes/flat.min.css')
injectStyle('https://cdn.jsdelivr.net/npm/medium-editor@5.23.2/dist/css/medium-editor.min.css')

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
        targetBlank: true,
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
    freeze () { this.destroy() },
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
