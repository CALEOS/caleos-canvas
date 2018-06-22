import Vue from 'vue'
import App from './App.vue'
import '../assets/app.styl'
import Place from './js/Place'

Vue.prototype.$place = new Place()

// import zoom from './js/zoom.js'
// import eos from './js/eos.js'
// import canvasse from './js/canvasse'
// import place from './js/place'

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
