<template>
  <div class="app-container">
    <!-- <UserInfo name="user-info" /> -->
    <CanvasContainer name=" pixels" />
    <FooterContainer name="" />
    <button
      v-shortkey.once="['-']"
      class="hotkey"
      @shortkey="zoomOut()"
    />
    <button
      v-shortkey.once="['+']"
      class="hotkey"
      @shortkey="zoomIn()"
    />
    <button
      v-shortkey.once="['enter']"
      class="hotkey"
      @shortkey="sendTransaction()"
    />
  </div>
</template>

<script>
/* eslint-disable no-debugger */

import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs2'
import { Actions } from './actions'
import 'babel-polyfill'
// import UserInfo from './components/UserInfo.vue'
import CanvasContainer from './components/Canvas.vue'
import FooterContainer from './components/Footer.vue'
import {Api} from 'eosjs'

ScatterJS.plugins(new ScatterEOS())

export default {
  components: {
    // UserInfo,
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
    this.loadLeaderboard()
    this.setupWebSocket()
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
        this.$store.dispatch(Actions.SET_API, this.$store.state.scatter.eos(this.$store.state.network, Api, { rpc: this.$store.state.rpc, beta3: true }))
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
    },
    async loadLeaderboard () {
      // TODO: once nodeos is 1.5 and eosjs supports it, reverse sort the table search and don't sort locally
      let contract = this.$store.state.contract
      let leaderboardResponse = await this.$store.state.rpc.get_table_rows({
        code: contract,
        scope: contract,
        table: 'accounts',
        index_position: 2,
        key_type: 'i64'
      })

      if (leaderboardResponse.rows.length) {
        leaderboardResponse.rows.sort(function (a, b) { return b.total_paint_count - a.total_paint_count })
        this.$store.dispatch(Actions.SET_LEADERBOARD, leaderboardResponse.rows)
      }
    },
    zoomOut () {
      this.$root.$emit('zoom-out')
    },
    zoomIn () {
      this.$root.$emit('zoom-in')
    },
    sendTransaction () {
      this.$root.$emit('trigger-transaction')
    },
    setupWebSocket () {
      let wsUrl = 'wss://canvas.caleos.io/ws'
      this.ws = new WebSocket(wsUrl)

      let _this = this
      this.ws.onmessage = function (ev) {
        // TODO: Check for ping messages and ignore, they're {"action":"ping"}
        console.log('GOT MESSAGE: ' + ev.data)
        let eventObj = JSON.parse(ev.data)
        if (eventObj.action === 'paintAction') { _this.$store.dispatch(Actions.PUSH_PAINT_HISTORY, eventObj.data) }
        console.log(eventObj)
      }
    }
  }

}
</script>
