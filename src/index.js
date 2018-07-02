import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import '../assets/app.styl'
import Place from './js/Place'
import 'vue-awesome/icons/flag'

Vue.prototype.$place = new Place()
Vue.prototype.$canvasse = null

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    activeTool: null,
    activeColorName: null,
    activeColorHex: null,
    reloading: false
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setActiveTool (state, toolName) {
      state.activeTool = toolName
    },
    setActiveColorName (state, colorName) {
      state.activeColorName = colorName
    },
    setActiveColorHex (state, colorHex) {
      state.activeColorHex = colorHex
    },
    setLoadingStatus (state, boolStatus) {
      state.activeTool = boolStatus
    }
  }
})
/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
