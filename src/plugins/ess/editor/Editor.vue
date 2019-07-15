<template>
  <main id="editor">
    <m-button id="new-question" ref="new" unelevated>{{texts.new}}</m-button>
  </main>
</template>

<style lang="scss">
@import './styles.scss';
@import 'material-components-vue/dist/button/styles';

main {
  padding: 10px;
}

#new-question {
  float: right;
}
</style>

<script>
import MButton from 'material-components-vue/dist/button'
import hooks from './hooks'

Vue.use(MButton)

export default {
  name: 'Editor',
  components: {},
  computed: {
    texts() {
      let texts = {
        new: 'Add question',
      }
      hooks.emit('editor:texts', [this, t => texts = Object.assign(texts, t)])
      return texts
    },
  },
}
</script>
