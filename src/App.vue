<template>
  <div class="app-container">
    <UserInfo name="user-info" />
    <CanvasContainer name=" pixels" />
    <FooterContainer name="" />
  </div>
</template>

<script>
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs2'
import { Actions } from './actions'
import 'babel-polyfill'
import UserInfo from './components/UserInfo.vue'
import CanvasContainer from './components/Canvas.vue'
import FooterContainer from './components/Footer.vue'
import {Api} from 'eosjs'

ScatterJS.plugins(new ScatterEOS())

export default {
  components: {
    UserInfo,
    CanvasContainer,
    FooterContainer
  },

  computed: {
    account () {
      if (!this.$store.state.scatter || !this.$store.state.scatter.identity) return null
      return this.$store.state.scatter.identity.accounts[0]
    }
  },

  watch: {
    account () {
      this.setApiInstance()
    }
  },

  mounted () {
    this.setApiInstance()
    this.loadContractConfig()
    let _this = this
    ScatterJS.scatter.connect(this.$store.state.scatterAppName).then(connected => {
      if (!connected) {
        console.error('Could not connect to Scatter.')
        return
      }
      _this.$store.dispatch(Actions.SET_SCATTER, ScatterJS.scatter)
      window.ScatterJS = null
    })
  },

  methods: {
    setApiInstance () {
      if (this.account) {
        this.$store.dispatch(Actions.SET_API, this.$store.state.scatter.eos(this.$store.state.network, Api, {rpc: this.$store.state.rpc}))
      } else {
        this.$store.dispatch(Actions.SET_API, new Api({ rpc: this.$store.state.rpc }))
      }
    },
    async loadContractConfig () {
      let contract = this.$store.state.contract
      let configResponse = await this.$store.state.rpc.get_table_rows({
        code: contract,
        scope: contract,
        table: 'config'
      })

      if (configResponse.rows.length) {
        this.$store.dispatch(Actions.SET_CONTRACT_CONFIG, configResponse.rows[0])
      }
    }
  }

}
</script>
