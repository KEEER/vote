<template>
  <header class="mdc-top-app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <a href="#" @click="nav" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
        <span class="mdc-top-app-bar__title">Title</span>
      </section>
    </div>
  </header>
</template>

<script>
import {MDCTopAppBar} from '@material/top-app-bar'

export default {
  data() {
    return {}
  },
  mounted() {
    MDCTopAppBar.attachTo(this.$el)
  },
  methods: {
    nav() {
      this.$root.$emit('nav')
    }
  },
}

</script>
