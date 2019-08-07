<template>
  <div>
    <m-drawer ref="drawer" :modal="modal" :dismissible="dismissible" :open="drawerOpen" :key="modal">
      <m-drawer-header slot="header" :title="texts.drawerTitle" />
      <m-drawer-content>
        <m-drawer-list>
          <span v-for="route in routes" :key="route.name">
            <router-link class="navlink" :to="{name: route.name}">
              <m-list-item :activated="$route.name === route.name">
                <m-icon :icon="route.icon" slot="graphic"/>
                {{route.title}}
              </m-list-item>
            </router-link>
          </span>
        </m-drawer-list>
      </m-drawer-content>
    </m-drawer>
    <m-drawer-scrim v-if="modal" />
    <div id="content">
      <m-top-app-bar ref="appbar" :title="texts.appBarTitle">
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
@import 'material-components-vue/dist/list/styles';
</style>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
.mdc-drawer--dismissible.mdc-drawer--open ~ #content{
  margin-left: 255px;
}

a.navlink {
  text-decoration: none;
}
</style>

<script>
import VueRouter from 'vue-router'
import MTopAppBar from 'material-components-vue/dist/top-app-bar/top-app-bar.min.js'
import MDrawer from 'material-components-vue/dist/drawer/drawer.min.js'
import MList from 'material-components-vue/dist/list/list.min.js'
import MIcon from 'material-components-vue/dist/icon/icon.min.js'
import Editor from './Editor.vue'
import Settings from './Settings.vue'
import hooks from './hooks'
import {query} from '../common/graphql'

;[
  MTopAppBar,
  MDrawer,
  MIcon,
  MList,
].forEach(component => Vue.use(component))

const routes = [
  {
    path: '/:uid/:id/edit',
    name: 'edit',
    component: Editor,
    icon: 'edit',
    title: 'Editor',
  },
  {
    path: '/:uid/:id/settings',
    name: 'settings',
    component: Settings,
    icon: 'settings',
    title: 'Settings',
  },
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
      texts: {
        drawerTitle: null,
        appBarTitle: 'Vote Editor',
      },
      routes,
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
    this.texts.drawerTitle = this.formId
    
    ;(async () => {
      const title = (await query('{ form { title } }', {})).data.form.title
      this.texts.appBarTitle = `${title} - Vote Editor`
      document.title = `${title} - ${document.title}`
    })()
    hooks.emit('editor:appMounted', [this])
  },
})
</script>
