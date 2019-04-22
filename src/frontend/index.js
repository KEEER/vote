// import Vue from 'vue';
import App, {router} from './App';

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)


new Vue({
  el: '#app',
  render: h => h(App),
  router
});
