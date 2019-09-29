<template>
  <div>
    <m-text-field
      outlined
      required
      v-model="title_"
      :id="`${uid}-title`"
      class="form-title"
    >
      <m-floating-label :for="`${uid}-title`">{{texts.titlePlaceholder}}</m-floating-label>
    </m-text-field>
  </div>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/text-field/styles';
@import 'material-components-vue/dist/floating-label/styles';
</style>

<style scoped>
.form-title {
  width: 100%;
}
</style>

<script>
import MTextField from 'material-components-vue/dist/text-field/text-field.min.js'
import MFloatingLabel from 'material-components-vue/dist/floating-label/floating-label.min.js'

Vue.use(MTextField)
Vue.use(MFloatingLabel)

export default {
  name: 'BasicSettings',
  data() {
    return {
      title_: '',
    }
  },
  props: {
    texts: Object,
  },
  watch: {
    title_(val) {
      // TODO: save update
      console.log(val)
    },
    title(val) {
      this.title_ = val
    },
  },
  computed: {
    title() {
      return this.$root.$children[0].title
    },
  },
}
</script>
