import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import '../assets/app.styl'
import Place from './js/Place'
import 'vue-awesome/icons/flag'

Vue.prototype.$place = new Place()
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    activeTool: null,
    activeColor: null
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setActiveTool (state, toolName) {
      state.activeTool = toolName
    },
    setActiveColor (state, colorName) {
      state.activeColor = colorName
    }
  }
})

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
