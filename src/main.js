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
import { KeycatAuthenticator } from '@telosnetwork/ual-telos-keycat'
import { Anchor } from 'ual-anchor'
import { UAL } from 'universal-authenticator-library'

import { Api, JsonRpc } from 'eosjs'

const chain = {
  chainId: process.env.VUE_APP_CHAIN_ID,
  rpcEndpoints: [
    {
      protocol: process.env.VUE_APP_PROTOCOL,
      host: process.env.VUE_APP_ENDPOINT,
      port: process.env.VUE_APP_PORT
    }
  ]
}

const authenticators = [
  new KeycatAuthenticator([chain], { appName: process.env.VUE_APP_NAME }),
  new Anchor([chain], { appName: process.env.VUE_APP_NAME })
]

const ual = new UAL([chain], 'ual', authenticators)

const signTransaction = async function (actions) {
  actions.forEach(action => {
    if (!action.authorization || !action.authorization.length) {
      action.authorization = [
        {
          actor: this.state.account.accountName,
          permission: 'active'
        }
      ]
    }
  })
  let transaction = null
  try {
    if (this.$type === 'ual') {
      transaction = await this.$ualUser.signTransaction(
        {
          actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      )
    }
  } catch (e) {
    console.log(actions, e.cause.message)
    throw e.cause.message
  }
  return transaction
}

const getRpc = function () {
  return this.$type === 'ual' ? this.$ualUser.rpc : this.$defaultApi.rpc
}

const getTableRows = async function (options) {
  const rpc = this.$api.getRpc()
  return rpc.get_table_rows({
    json: true,
    ...options
  })
}

const getAccount = async function (accountName) {
  const rpc = this.$api.getRpc()
  return rpc.get_account(accountName)
}

const rpc = new JsonRpc(
  `${process.env.VUE_APP_PROTOCOL}://${process.env.VUE_APP_ENDPOINT}:${process.env.VUE_APP_PORT}`
)
store['$defaultApi'] = new Api({
  rpc,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
})

store['$api'] = {
  signTransaction: signTransaction.bind(store),
  getTableRows: getTableRows.bind(store),
  getAccount: getAccount.bind(store),
  getRpc: getRpc.bind(store)
}

store['$ual'] = ual
Vue.prototype.$ual = ual

Vue.use(Vuex)
Vue.use(require('vue-shortkey'))

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
