import Vue from 'vue'
import App from './App.vue'
import '../assets/app.styl'
import Place from './js/Place'
import 'vue-awesome/icons/flag'

Vue.prototype.$place = new Place()

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
