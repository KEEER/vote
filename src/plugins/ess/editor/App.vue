<template>
  <div>
    <m-drawer></m-drawer>
    <div id="content">
      <m-top-app-bar title="Vote Editor">
        <m-icon icon="menu" slot="navigation" />
      </m-top-app-bar>
      <m-top-app-bar-fixed-adjust>
        <router-view />
      </m-top-app-bar-fixed-adjust>
    </div>
  </div>
</template>

<style lang="scss">
$mdc-theme-primary: #005c5c;
$mdc-theme-accent: #002d4d;
$mdc-theme-background: #fff;

@import 'material-components-vue/dist/top-app-bar/styles';
@import 'material-components-vue/dist/drawer/styles';
@import 'material-components-vue/dist/typography/styles';
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
import VueRouter from 'vue-router'
import TopAppBar from 'material-components-vue/dist/top-app-bar'
import Drawer from 'material-components-vue/dist/drawer'
import Icon from 'material-components-vue/dist/icon'

Vue.use(VueRouter)
Vue.use(TopAppBar)
Vue.use(Icon)
Vue.use(Drawer)

const routes = [
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
  components: {},
})
console.log('Loaded')
</script>
