<template>
  <m-card></m-card>
</template>

<style lang="scss">
@import '../styles.scss';
@import 'material-components-vue/dist/card/styles';
</style>

<script>
import MCard from 'material-components-vue/dist/card/card.min.js'

Vue.use(MCard)

export default {
  name: 'Question',
}
</script>
