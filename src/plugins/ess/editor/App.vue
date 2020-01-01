<template>
  <div>
    <m-drawer
      ref="drawer"
      :class="{'drawer-dismissible': dismissible}"
      :modal="modal"
      :dismissible="dismissible"
      :open="drawerOpen"
      :key="modal"
    >
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
      <m-top-app-bar ref="appbar">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <m-icon icon="menu" class="mdc-top-app-bar__navigation-icon" />
          <span class="hgroup mdc-top-app-bar__title">
            <div>{{texts.appBarTitle}}</div>
            <div class="mdc-top-app-bar__subtitle" v-if="texts.appBarSubtitle">
              {{texts.appBarSubtitle}}
            </div>
          </span>
        </section>
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

.drawer-dismissible {
  position: fixed;
  top: 0;
  left: 0;
}

.hgroup {
  display: flex;
  flex-direction: column;
  overflow: visible;
  line-height: 1.5rem;
}

.mdc-top-app-bar__subtitle {
  font-size: 0.9rem;
  line-height: 0.9rem;
  color: #b0bec5;
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
import Fill from './Fill.vue'
import hooks from './hooks'
import { query } from '../common/graphql'

;[
  MTopAppBar,
  MDrawer,
  MIcon,
  MList,
].forEach(component => Vue.use(component))

const routes = [
  {
    path: '/:uid/:id/fill',
    name: 'fill',
    component: Fill,
    icon: 'open_in_new',
    title: 'Fill',
  },
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
export { router }

export default Vue.extend({
  data: function () {
    return {
      modal: false,
      dismissible: true,
      drawerOpen: false,
      texts: {
        drawerTitle: null,
        appBarTitle: 'Vote Editor',
        appBarSubtitle: null,
      },
      title: '',
      documentTitle: document.title,
      routes,
    }
  },
  methods: {
    toggleDrawer () {
      this.drawerOpen = !this.drawerOpen
    },
    updateTitle () {
      this.texts.appBarTitle = `${this.title} - Vote Editor`
      document.title = `${this.title} - ${this.documentTitle}`
      this.$emit('update:title', this.title)
    },
  },
  computed: {
    formId () {
      return `${this.$route.params.uid} / ${this.$route.params.id}`
    },
  },
  components: {},
  mounted () {
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
      this.title = title
      this.updateTitle()
    })()
    hooks.emit('editor:appMounted', [ this ])
  },
})
</script>
