<template>
  <div class="vote-main">
    <Form :title="data.title" :action="data.action" :method="data.method" />
  </div>
</template>

<style scoped>
.vote-main { padding: 200px 16px; }
@media (max-width: 752px) { .vote-main { padding: 128px 16px 16px; } }
</style>

<script>
import Form from './Form'
import tinycolor from 'tinycolor2'

export default {
  components: { Form },
  data () {
    return { data: window.KVoteFormData, colors: {} }
  },
  provide () {
    return {
      data: window.KVoteFormData,
      colors: this.colors,
    }
  },
  mounted () {
    const colors = { themeColor: 'theme-color', secondaryColor: 'secondary-color', bgColor: 'bg-color', textColor: 'text-color' }
    for (let i in colors) {
      if (window.KVoteFormData.config && window.KVoteFormData.config.settings && window.KVoteFormData.config.settings[`theme-default.${colors[i]}`]) {
        const color = tinycolor(window.KVoteFormData.config.settings[`theme-default.${colors[i]}`])
        if (color.isValid()) this.colors[i] = color
      }
    }
    // FIXME: hack
    if (this.colors.themeColor || this.colors.secondaryColor) {
      const themeColor = this.colors.themeColor || tinycolor('#005c5c')
      const secondaryColor = this.colors.secondaryColor || tinycolor('#002d4d')
      const style = Array.from(document.styleSheets[1].cssRules).map(x => x.cssText).join('')
      const themeRgb = themeColor.toRgb()
      const secondaryRgb = secondaryColor.toRgb()
      let newStyle = style
        .replace(/#005c5c/g, '__placeholder1')
        .replace(/0, 92, 92/g, '__placeholder2')
        .replace(/#002d4d/g, '__placeholder3')
        .replace(/0, 45, 77/g, '__placeholder4')
        .replace(/__placeholder1/g, themeColor.toHexString())
        .replace(/__placeholder2/g, `${themeRgb.r}, ${themeRgb.g}, ${themeRgb.b}`)
        .replace(/__placeholder3/g, secondaryColor.toHexString())
        .replace(/__placeholder4/g, `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`)
      const el = document.createElement('style')
      el.innerHTML = newStyle
      document.head.appendChild(el)
    }
  },
}
</script>
