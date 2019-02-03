import Vue from 'vue'
import './plugins/vuetify'
import Vuex from 'vuex'
import App from './App.vue'
import '../assets/app.styl'
import 'babel-polyfill'
import 'vue-awesome/icons/flag'
import 'vuetify/src/stylus/app.styl'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { store } from './store'

Vue.use(Vuex)
Vue.use(require('vue-shortkey'))

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
