<template>
  <div>
    <Drawer />
    <div id="content">
      <TopAppBar />
      <main class="mdc-top-app-bar--fixed-adjust">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
$mdc-theme-primary: #005c5c;
$mdc-theme-accent: #002d4d;
$mdc-theme-background: #fff;

@import 'material-components-web/material-components-web';
</style>

<style>
body {
  margin: 0;
}
.mdc-drawer--dismissible.mdc-drawer--open ~ #content{
  margin-left: 255px;
}
main {
  padding: 10px;
}
</style>

<script>
// import Vue from 'vue'
import VueRouter from 'vue-router'

import Drawer from './Drawer'
import TopAppBar from './TopAppBar'

import Home from './Home'

Vue.use(VueRouter)

const routes = [
  {path: '/', component: Home},
  {path: '/3', component: {render: ce => ce('div')}},
  {path: '/2', component: {render: ce => ce('div')}},
  {path: '/1', component: {render: ce => ce('div')}},
]
const router = new VueRouter({
  mode: 'history',
  routes,
})
export {router}

export default Vue.extend({
  data: function() {
    return {}
  },
  methods: {},
  components: {
    Drawer,
    TopAppBar,
  },
})
console.log('Loaded')
</script>
