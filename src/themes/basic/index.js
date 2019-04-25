// import Vue from 'vue'
import App from './App'
import hooks from './hooks'

window.voteHooks = hooks
window.dispatchEvent(new Event('vote:ready'))

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

window.vm = new Vue({
  el: '#app',
  render: h => h(App),
})
