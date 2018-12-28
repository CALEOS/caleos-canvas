import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import '../assets/app.styl'
import 'babel-polyfill'
import Place from './js/Place'
import 'vue-awesome/icons/flag'

import { store } from './store'

Vue.prototype.$place = new Place()
Vue.prototype.$canvasse = null

Vue.use(Vuex)

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
