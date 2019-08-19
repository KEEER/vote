<template>
  <m-card class="question">
    <div class="title-type">
      <m-text-field
        outlined
        required
        v-model="title_"
        :id="`${uid}-title`"
        class="question-title"
      >
        <m-floating-label :for="`${uid}-title`">{{texts.question.title}}</m-floating-label>
        <m-line-ripple slot="bottomLine" />
      </m-text-field>
      <TypeSelector v-model="type_" :texts="texts" />
    </div>
    <component
      :is="data.type || 'VNull'"
      v-model="value_"
      :options.sync="options_"
      :texts="texts"
    />
  </m-card>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/card/styles';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/floating-label/styles';
@import 'material-components-vue/dist/line-ripple/styles';
</style>

<style scoped>
.question {
  padding: 16px;
  margin: 16px;
}

.question-title {
  flex: auto;
}

/* TODO: mobile display */
.title-type {
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
}
</style>

<style>
.question-title .mdc-text-field__input {
  font-size: 1.5rem;
}
</style>

<script>
import MCard from 'material-components-vue/dist/card/card.min.js'
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'
import MLineRipple from 'material-components-vue/dist/line-ripple/line-ripple.min.js'
import questionTypes from './types'
import TypeSelector from './TypeSelector.vue'

;[MCard,
  MTextField,
  MFloatingLabel,
  MLineRipple,
].forEach(component => Vue.use(component))

export default {
  name: 'Question',
  data() {
    return {
      title_: this.data.title,
      value_: this.data.value,
      options_: this.data.options,
      type_: this.data.type,
    }
  },
  components: {
    ...questionTypes,
    TypeSelector,
  },
  props: {
    // TODO: check props
    data: Object,
    texts: Object,
  },
  watch: {
    data() {
      this.title_ = this.data.title
      this.value_ = this.data.value
      this.options_ = this.data.options
      this.type_ = this.data.type
    },
    title_(val) {
      this.$emit('update:title', val)
    },
    value_(val) {
      this.$emit('update:value', val)
    },
    options_(val) {
      this.$emit('update:options', val)
    },
    type_(val) {
      this.data.type = val
      this.$emit('update:type', val)
    },
  },
}
</script>