import 'regenerator-runtime'
import App, { getRouter } from './App'
import hooks from './hooks'
import UniqueId from 'vue-unique-id'

window.onload = () => {
  window.voteHooks = hooks
  window.dispatchEvent(new Event('vote:ready'))

  const root = document.createElement('div')
  root.id = 'app'
  document.body.appendChild(root)

  Vue.use(UniqueId)

  Vue.nextTick(() => new Vue({
    el: '#app',
    render: h => h(App),
    router: getRouter(),
  }))
}
