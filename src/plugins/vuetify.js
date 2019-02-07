import Vue from 'vue'
import Vuetify, {
  VApp,
  VIcon,
  VBtn,
  VDialog,
  VDataTable,
  VList,
  VTextField
} from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VIcon,
    VBtn,
    VDialog,
    VDataTable,
    VList,
    VTextField
  },
  iconfont: 'md'
})
