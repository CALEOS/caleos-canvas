<template>
  <div class="app-container">
    <HeaderContainer name="header" />
    <CanvasContainer name="pixels" />
    <FooterContainer name />
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
import HeaderContainer from './components/Header'
import CanvasContainer from './components/CanvasTest.vue'
import FooterContainer from './components/Footer.vue'
import { Api } from 'eosjs'
import moment from 'moment'
import { setInterval } from 'timers'

ScatterJS.plugins(new ScatterEOS())

export default {
  components: {
    HeaderContainer,
    CanvasContainer,
    FooterContainer
  },

  computed: {
    account () {
      if (!this.$store.state.scatter || !this.$store.state.scatter.identity) {
        return null
      }
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
    // this.setupWebSocket()
    let _this = this
    ScatterJS.scatter
      .connect(this.$store.state.scatterAppName)
      .then(connected => {
        if (!connected) {
          console.error('Could not connect to Scatter.')
          return
        }
        _this.$store.dispatch(Actions.SET_SCATTER, ScatterJS.scatter)
        window.ScatterJS = null
      })
    this.startWatcher()
  },

  methods: {
    setApiInstance () {
      if (this.account) {
        this.$store.dispatch(
          Actions.SET_API,
          this.$store.state.scatter.eos(this.$store.state.network, Api, {
            rpc: this.$store.state.rpc,
            beta3: true
          })
        )
      } else {
        this.$store.dispatch(
          Actions.SET_API,
          new Api({ rpc: this.$store.state.rpc })
        )
      }
    },
    async loadContractConfig () {
      this.$store.dispatch(
        Actions.LOAD_CONTRACT_CONFIG
      )
    },
    async loadLeaderboard () {
      this.$store.dispatch(Actions.LOAD_LEADERBOARD)
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
        if (eventObj.action === 'chat') {
          _this.$store.dispatch(Actions.PUSH_CHAT_HISTORY, eventObj.data)
        }
        console.log(eventObj)
      }

      this.$root.$on('sendMessage', data => {
        this.ws.send(data)
      })
    },
    startWatcher () {
      if (!this.intervalId) {
        this.intervalId = setInterval(this.doWatcher, 500)
      }
    },
    doWatcher () {
      this.updateCooldown()
      this.updatePixelsRemaining()
    },
    updateCooldown () {
      if (!this.$store.state.config || !this.$store.state.contractAccount) return

      let cooldown = this.$store.state.config.settings.find(
        setting => setting.key === 'cooldown'
      ).value

      let lastActivitySeconds = moment
        .utc(this.$store.state.contractAccount.last_activity)
        .unix()

      let cooldownExpires = this.$store.state.contractAccount
        ? moment.unix(lastActivitySeconds + cooldown)
        : moment.unix()
      this.$store.dispatch(Actions.SET_COOLDOWN_EXPIRES, cooldownExpires)
    },
    updatePixelsRemaining () {
      if (!this.$store.state.config) return
      let pixelsRemaining = 0

      let pixelsPer = this.$store.state.config.settings.find(
        setting => setting.key === 'pixelsper'
      ).value

      let inCooldown =
        this.$store.state.cooldownExpire.isAfter &&
        this.$store.state.cooldownExpire.isAfter()
      if (inCooldown) {
        pixelsRemaining =
          pixelsPer -
          this.$store.state.contractAccount.session_paint_score -
          this.$store.state.pixelObjArray.length
      } else {
        pixelsRemaining = pixelsPer - this.$store.state.pixelObjArray.length
      }

      this.$store.dispatch(Actions.SET_PIXELS_REMAINING, pixelsRemaining)
    }
  }
}
</script>
