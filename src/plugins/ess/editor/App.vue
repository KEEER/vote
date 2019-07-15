<template>
  <div>
    <m-drawer ref="drawer" :modal="modal" :dismissible="dismissible" :open="drawerOpen">
      <m-drawer-header slot="header" :title="formId" />
      <m-drawer-content></m-drawer-content>
    </m-drawer>
    <div id="content">
      <m-top-app-bar ref="appbar" title="Vote Editor">
        <m-icon icon="menu" slot="navigation" />
      </m-top-app-bar>
      <m-top-app-bar-fixed-adjust>
        <router-view />
      </m-top-app-bar-fixed-adjust>
    </div>
  </div>
</template>

<style lang="scss">
@import './styles.scss';
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
</style>

<script>
import VueRouter from 'vue-router'
import MTopAppBar from 'material-components-vue/dist/top-app-bar'
import MDrawer from 'material-components-vue/dist/drawer'
import MIcon from 'material-components-vue/dist/icon'
import Editor from './Editor.vue'

;[
  MTopAppBar,
  MDrawer,
  MIcon,
].forEach(component => Vue.use(component))

const routes = [
  {path: '/:uid/:id/edit', component: Editor},
]
const router = new VueRouter({
  mode: 'history',
  routes,
})
export {router}

export default Vue.extend({
  data: function() {
    return {
      modal: false,
      dismissible: true,
      drawerOpen: false,
    }
  },
  methods: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    },
  },
  computed: {
    formId() {
      return `${this.$route.params.uid} / ${this.$route.params.id}`
    },
  },
  components: {},
  mounted() {
    const drawer = this.$refs.drawer
    const media = window.matchMedia('(max-width: 720px)')

    const toggleMobile = () => {
      const isMobile = media.matches
      if (isMobile) {
        this.dismissible = false
        this.modal = true
      } else {
        this.modal = false
        this.dismissible = true
      }

      this.$nextTick(() => this.drawerOpen = !isMobile)
    }
    media.addListener(toggleMobile)
    toggleMobile()

    this.$refs.appbar.$on('nav', () => this.toggleDrawer())
  },
})
</script>
