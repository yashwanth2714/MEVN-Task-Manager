import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue';
import router from "./router";
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import store from './store'
import 'animate.css';

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use( CKEditor );
Vue.use(require('vue-moment'));

export const bus = new Vue();

Vue.filter('truncate', function (str, len) {
  if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
  }
  return str
})

Vue.filter('stripTags', function (input) {
  return input.replace(/<(?:.|\n)*?>/gm, '')
})

Vue.filter('removeSpaces', function (input) {
  return input.replace(/&nbsp;/g, '');
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
