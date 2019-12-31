// import Vue from 'vue';
import App, { router } from './App'
import hooks from './hooks'
import UniqueId from 'vue-unique-id'

window.onload = () => {
  window.voteHooks = hooks

  const root = document.createElement('div')
  root.id = 'app'
  document.body.appendChild(root)

  Vue.use(UniqueId)

  new Vue({
    el: '#app',
    render: h => h(App),
    router,
  })
}
