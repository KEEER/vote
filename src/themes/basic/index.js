import 'regenerator-runtime'
import App from './App'
import hooks from './hooks'
import UniqueId from 'vue-unique-id'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

Vue.use(UniqueId)

window.onload = () => {
  window.voteHooks = hooks
  window.dispatchEvent(new Event('vote:ready'))

  window.vm = new Vue({
    el: '#app',
    render: h => h(App),
  })
}
