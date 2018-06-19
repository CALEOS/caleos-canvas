import Vue from 'vue'
import App from './App.vue'
import '../assets/app.styl'


//pull in app component render it with id 'app'
new Vue({
  el: '#app',
  render: h => h(App)
})
