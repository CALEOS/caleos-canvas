<template>
  <div class="app-container rows">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <HeaderContainer name="header" />
    <CanvasContainer name="pixels" class="pb-2 pa-2" />
    <FooterContainer name="footer" />
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
import { Actions } from './actions'
import 'babel-polyfill'
import HeaderContainer from './components/Header'
import CanvasContainer from './components/CanvasTest.vue'
import FooterContainer from './components/Footer.vue'
import moment from 'moment'
import { setInterval } from 'timers'

export default {
  components: {
    HeaderContainer,
    CanvasContainer,
    FooterContainer
  },

  computed: {
    account () {
      return this.$store.state.account.accountName
    }
  },

  mounted () {
    this.setupUAL()
    this.loadContractConfig()
    this.loadLeaderboard()
    this.startWatcher()
  },

  methods: {
    setupUAL () {

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
