// import Vue from 'vue';
import App, {router} from './App'
import UniqueId from 'vue-unique-id'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

Vue.use(UniqueId)

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
