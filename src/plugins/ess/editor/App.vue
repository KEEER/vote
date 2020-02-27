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
      <div slot="header">
        <m-typo-body :level="1" class="username">
          <a href="/?utm_source=editor&utm_medium=drawer_header" class="username-link">{{userName}}</a>
        </m-typo-body>
        <m-typo-headline :level="5" class="formname">{{formName}}</m-typo-headline>
      </div>
      <m-drawer-content>
        <m-drawer-list>
          <span v-for="route in routes" :key="route.name">
            <router-link class="navlink" :to="{name: route.name}">
              <m-list-item :activated="$route.name === route.name">
                <m-icon :icon="route.icon" slot="graphic"/>
                {{$t(route.title)}}
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
          <m-icon-button icon="menu" class="mdc-top-app-bar__navigation-icon" />
          <span class="hgroup mdc-top-app-bar__title">
            <div>{{appBarTitle}}</div>
            <div class="mdc-top-app-bar__subtitle" v-if="appBarSubtitle">
              {{appBarSubtitle}}
            </div>
          </span>
        </section>
        <section id="idframe" class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"></section>
      </m-top-app-bar>
      <m-top-app-bar-fixed-adjust>
        <div class="lang-fallback" v-if="$t('isFallback') === 'true'">
          {{$t('languageNotSupported.beforeLink')}}
          <a :href="$t('languageNotSupported.link')">{{$t('languageNotSupported.linkLabel')}}</a>
          {{$t('languageNotSupported.afterLink')}}
        </div>
        <router-view id="main" />
      </m-top-app-bar-fixed-adjust>
    </div>
  </div>
</template>

<style lang="scss" src="./styles.scss"></style>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
#main, .lang-fallback {
  max-width: 720px;
}

.mdc-drawer--dismissible.mdc-drawer--open ~ #content {
  margin-left: 255px;
}

.mdc-drawer--dismissible.mdc-drawer--open ~ #content .mdc-top-app-bar {
  width: calc(100% - 255px);
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

.lang-fallback {
  box-sizing: border-box;
	border-left: #dc3232 solid 4px;
	padding: 12px;
	-webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .1);
	box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.1);
  background-color: #ffaaaa;
  margin: 12px;
}

#idframe {
  --mdc-theme-primary: #fff;
  padding: 0;
  align-items: start;
  padding-top: 12px;
  padding-right: 12px;
}

@media(max-width: 599px) {
  #idframe {
    padding-top: 8px;
    padding-right: 8px;
  }
}

.username, .formname {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.username {
  margin-top: 16px;
  color: rgba(0, 0, 0, .6);
}

.username-link:link, .username-link:visited {
  color: inherit;
  text-decoration: none;
}

.username-link:hover, .username-link:focus, .username-link:active {
  text-decoration: underline;
}

.username::after {
  content: ' /';
}

.formname {
  color: rgba(0, 0, 0, .87);
}
</style>

<script>
import './mdc-init'
import VueRouter from 'vue-router'
import Data from './Data.vue'
import Editor from './Editor.vue'
import Settings from './Settings.vue'
import Fill from './Fill.vue'
import hooks from './hooks'

{
  const el = document.createElement('script')
  el.src = 'https://idframe.keeer.net/js/appbar.js'
  document.head.appendChild(el)
  window.idFrame = { mdc: { style: true } }
}

const routes = [
  {
    path: '/:uname/:name/fill',
    name: 'fill',
    component: Fill,
    icon: 'open_in_new',
    title: 'plugin.ess.app.route.fill',
  },
  {
    path: '/:uname/:name/edit',
    name: 'edit',
    component: Editor,
    icon: 'edit',
    title: 'plugin.ess.app.route.edit',
  },
  {
    path: '/:uname/:name/data',
    name: 'data',
    component: Data,
    icon: 'info',
    title: 'plugin.ess.app.route.data',
  },
  {
    path: '/:uname/:name/settings',
    name: 'settings',
    component: Settings,
    icon: 'settings',
    title: 'plugin.ess.app.route.settings',
  },
]

export function getRouter () {
  hooks.emit('editor:beforeRouterLoad', [ routes ])
  return new VueRouter({
    mode: 'history',
    routes,
  })
}

export default Vue.extend({
  data: function () {
    return {
      modal: false,
      dismissible: true,
      drawerOpen: false,
      drawerTitle: null,
      appBarTitle: 'Vote Editor',
      appBarSubtitle: null,
      title: window.KVoteFormData.title,
      userName: window.KVoteFormData.userName,
      formName: window.KVoteFormData.name,
      documentTitle: document.title,
      routes,
    }
  },
  methods: {
    toggleDrawer () {
      this.drawerOpen = !this.drawerOpen
    },
    updateTitle () {
      this.appBarTitle = `${this.title} - Vote Editor`
      document.title = `${this.title} - ${this.documentTitle}`
      this.$emit('update:title', this.title)
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

    this.updateTitle()
    hooks.emit('editor:appMounted', [ this ])

    const iid = setInterval(() => {
      if ('AppBarFrame' in window.idFrame) {
        clearInterval(iid)
        new idFrame.AppBarFrame({
          container: '#idframe',
          // TODO: pro etc
        })
      }
    }, 500)
  },
})
</script>
