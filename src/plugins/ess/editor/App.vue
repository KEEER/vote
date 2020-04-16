<template>
  <div>
    <m-drawer
      ref="drawer"
      :class="{'drawer-permanent': !modal}"
      :modal="modal"
      v-model="drawerOpen"
      :key="modal"
    >
      <m-icon-button icon="arrow_back" href="/?utm_source=editor&utm_medium=drawer_header_icon" class="back-button" />
      <div class="mdc-drawer__header">
        <m-typo-body :level="1" class="username">
          <a href="/?utm_source=editor&utm_medium=drawer_header" class="username-link">{{ userName }}</a>
        </m-typo-body>
        <m-typo-headline :level="5" class="formname">{{ formName }}</m-typo-headline>
      </div>
      <m-drawer-content>
        <m-drawer-list>
          <span v-for="route in routes" :key="route.name">
            <router-link class="navlink" :to="{name: route.name}">
              <m-list-item :activated="$route.name === route.name" @click="modal ? drawerOpen = false : null">
                <m-icon :icon="route.icon" slot="graphic"/>
                {{ $t(route.title) }}
              </m-list-item>
            </router-link>
          </span>
        </m-drawer-list>
      </m-drawer-content>
    </m-drawer>
    <m-drawer-scrim v-if="modal" />
    <div id="content">
      <m-top-app-bar>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <m-icon-button v-if="modal" icon="menu" class="mdc-top-app-bar__navigation-icon" @click="drawerOpen = !drawerOpen" />
          <span class="hgroup mdc-top-app-bar__title">
            <div class="app-bar-title">{{ appBarTitle }}</div>
            <div class="mdc-top-app-bar__subtitle" v-if="appBarSubtitle">
              {{ appBarSubtitle }}
            </div>
          </span>
        </section>
        <section id="idframe" class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"></section>
      </m-top-app-bar>
      <m-top-app-bar-fixed-adjust>
        <div class="lang-fallback" v-if="$t('isFallback') === 'true'">
          {{ $t('languageNotSupported.beforeLink') }}
          <a :href="$t('languageNotSupported.link')">{{ $t('languageNotSupported.linkLabel') }}</a>
          {{ $t('languageNotSupported.afterLink') }}
        </div>
        <router-view id="main" />
      </m-top-app-bar-fixed-adjust>
    </div>
  </div>
</template>

<style>
body { margin: 0; }
</style>

<style scoped>
#main, .lang-fallback { max-width: 720px; }

.drawer-permanent ~ #content { margin-left: 255px; }
.drawer-permanent ~ #content .mdc-top-app-bar { width: calc(100% - 255px); }

a.navlink { text-decoration: none; }

.drawer-permanent {
  position: fixed;
  top: 0;
  left: 0;
}

.hgroup {
  display: flex;
  flex-direction: column;
  line-height: 1.5rem;
}

.app-bar-title {
  overflow: hidden;
  text-overflow: ellipsis;
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
	box-shadow: 0 1px 1px 0 rgba(0,0,0,0.1);
  background-color: #ffaaaa;
  margin: 12px;
}

#idframe {
  --mdc-theme-primary: #fff;
  align-items: start;
  padding: 12px 12px 0 0;
  min-width: 140px;
}

@media(max-width: 599px) {
  #idframe {
    padding-top: 8px;
    padding-right: 8px;
    min-width: 60px;
  }
}

.username, .formname {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.back-button { margin-top: 8px; }
.username { color: #666; }
.formname { color: #212121; }
.username-link:link, .username-link:visited {
  color: inherit;
  text-decoration: none;
}
.username-link:hover, .username-link:focus, .username-link:active { text-decoration: underline; }
.username::after { content: ' /'; }
</style>

<script>
import './vendor-init'
import VueRouter from 'vue-router'
import Data from './Data.vue'
import Editor from './Editor.vue'
import Fn from './Fn.vue'
import Settings from './Settings.vue'
import Stats from './Stats.vue'
import Fill from './Fill.vue'
import hooks from './hooks'
import types from './components/types'
import { injectScript, waitUntil } from '@vote/api'

window.idFrame = { mdc: { style: true } }
injectScript('https://idframe.keeer.net/js/appbar.js')

/**
 * @typedef {object} Route
 * @property {string} path Vue path
 * @property {string} name path name
 * @property {Component} component Vue component
 * @property {string} icon MD icon
 * @property {string} title title locale path
 */

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
    path: '/:uname/:name/stats',
    name: 'stats',
    component: Stats,
    icon: 'bar_chart',
    title: 'plugin.ess.app.route.stats',
  },
  {
    path: '/:uname/:name/fn',
    name: 'fn',
    component: Fn,
    icon: 'power',
    title: 'plugin.ess.app.route.fn',
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
  /**
   * Before router load event, inject routes here.
   * @event editor.editor:beforeRouterLoad
   * @type {Route[]}
   */
  hooks.emit('editor:beforeRouterLoad', routes)
  return new VueRouter({
    mode: 'history',
    routes,
  })
}

export default Vue.extend({
  data: function () {
    return {
      modal: false,
      drawerOpen: false,
      drawerTitle: null,
      appBarTitle: 'Vote Editor',
      appBarSubtitle: null,
      title: window.KVoteFormData.title,
      userName: window.KVoteFormData.userName,
      formName: window.KVoteFormData.name,
      documentTitle: document.title,
      routes,
      types,
    }
  },
  methods: {
    updateTitle () {
      this.appBarTitle = `${this.title} - Vote Editor`
      document.title = `${this.title} - ${this.documentTitle}`
      /**
       * Update title event.
       * @event editor:App#update:title
       * @type {string}
       */
      this.$emit('update:title', this.title)
    },
  },
  mounted () {
    const media = window.matchMedia('(max-width: 720px)')
    const toggleMobile = () => this.modal = media.matches
    media.addListener(toggleMobile)
    toggleMobile()

    this.updateTitle()
    /**
     * Editor app mounted event.
     * @event editor.editor:appMounted
     * @type {editor:App}
     */
    hooks.emit('editor:appMounted', this)

    waitUntil(() => 'AppBarFrame' in window.idFrame)
      .then(() => new idFrame.AppBarFrame({
        container: '#idframe',
        // TODO: pro etc
      }))
  },
})
</script>
