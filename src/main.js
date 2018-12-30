import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import '../assets/app.styl'
import 'babel-polyfill'
import 'vue-awesome/icons/flag'

import { store } from './store'

Vue.use(Vuex)

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
