<template>
  <m-card class="question">
    <m-text-field v-model="title_" :id="`${uid}-title`" class="question-title">
      <m-line-ripple slot="bottomLine" />
    </m-text-field>
  </m-card>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/card/styles';
</style>

<style scoped>
.question {
  padding: 16px;
  margin: 16px;
}
</style>

<style>
.question-title .mdc-text-field__input {
  font-size: 1.5rem;
}
</style>

<script>
import MCard from 'material-components-vue/dist/card/card.min.js'
import MTypography from 'material-components-vue/dist/typography/typography.min.js'
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MLineRipple from 'material-components-vue/dist/line-ripple/line-ripple.min.js'

;[MCard,
  MTypography,
  MTextField,
  MLineRipple,
].forEach(component => Vue.use(component))

export default {
  name: 'Question',
  data() {
    return {
      title_: this.data.title,
    }
  },
  props: {
    data: Object,
    texts: Object,
  },
  watch: {
    title_() {
      this.$emit('update:title', this.title_)
    },
  },
}
</script>
