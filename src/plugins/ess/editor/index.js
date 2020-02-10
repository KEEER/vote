import 'regenerator-runtime'
import App, { getRouter } from './App'
import hooks from './hooks'
import UniqueId from 'vue-unique-id'
import { messages } from '../../../../locale'

window.onload = () => {
  window.voteHooks = hooks
  window.dispatchEvent(new Event('vote:ready'))

  const root = document.createElement('div')
  root.id = 'app'
  document.body.appendChild(root)

  Vue.use(UniqueId)
  Vue.use(VueI18n)
  const i18n = new VueI18n({
    locale: navigator.language.slice(0, 2).toLowerCase(),
    messages,
  })

  Vue.nextTick(() => new Vue({
    el: '#app',
    i18n,
    render: h => h(App),
    router: getRouter(),
  }))
}
