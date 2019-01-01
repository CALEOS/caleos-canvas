<template>
  <div>
    <button
      v-if="myScatter && !account"
      @click="login"
    >
      Login with Scatter
    </button>
    <section
      v-if="myScatter && account"
      class="user-info"
    >
      <span>Logged in as: {{ account.name }}</span>
      <span>
        Lifetime pixels: {{ lifetimePixels }}
      </span>
      <button @click="logout">
        Logout
      </button>
      <span v-if="cooldownMessage">
        {{ cooldownMessage }}
      </span>
    </section>
    <span v-if="mySendingTransaction">
      Sending transaction...
    </span>
  </div>
</template>

<script>
/* eslint-disable no-debugger */

import { mapState } from 'vuex'
import { Actions } from '../actions'
import moment from 'moment'
import 'moment-countdown'

export default {
  data () {
    return {
      lifetimePixels: null,
      cooldownMessage: null,
      cooldownCountdown: null,
      cooldownInterval: null
    }
  },
  computed: {
    ...mapState({
      myScatter: 'scatter',
      myLastRefresh: 'lastRefresh',
      myIdentity: 'identity',
      mySendingTransaction: 'sendingTransaction',
      myContractConfig: 'config'
    }),
    account () {
      if (!this.$store.state.scatter || !this.$store.state.scatter.identity) return null
      return this.$store.state.scatter.identity.accounts[0]
    }
  },
  watch: {
    myLastRefresh () {
      this.loadAccount()
    },
    myIdentity () {
      this.loadAccount()
    }
  },
  mounted () {
    this.loadAccount()
  },
  methods: {
    async login () {
      await this.$store.state.scatter.getIdentity({accounts: [this.$store.state.network]}).catch(async err => {
        if (err.code === 402 && err.type === 'no_network') { await this.$store.state.scatter.suggestNetwork(this.$store.state.network) }
        this.loadIdentity()
      })
    },

    async logout () {
      await this.$store.state.scatter.forgetIdentity()
      this.loadIdentity()
    },

    loadIdentity () {
      this.$store.dispatch(Actions.SET_IDENTITY, this.$store.state.scatter.identity)
      this.loadAccount()
    },

    setCooldownMessage () {
      if (!this.$store.state.config) {
        return
      }

      let cooldown = this.$store.state.config.cooldown
      if (cooldown === 0) {
        this.cooldownInterval = null
        this.cooldownMessage = 'There is no cooldown, party mode 🎉🎉🎉'
        return
      }

      let friendlyCooldown = this.makeFriendlyDuration(cooldown)

      if (!this.$store.state.contractAccount) {
        this.cooldownInterval = null
        this.cooldownMessage = `The cooldown is ${friendlyCooldown}`
        return
      }

      let cooldownExpires = moment.unix(this.$store.state.contractAccount.last_access + this.$store.state.config.cooldown)
      if (cooldownExpires.isBefore()) {
        this.cooldownInterval = null
        this.cooldownMessage = 'Cooldown complete, time to paint!'
      } else {
        this.cooldownMessage = `Can paint again in ${cooldownExpires.countdown().toString()}`
        if (!this.cooldownInterval) {
          this.cooldownInterval = setInterval(this.setCooldownMessage, 1000)
        }
      }
    },

    makeFriendlyDuration (seconds) {
      return seconds > 60 ? Math.floor(seconds / 60) + ' min ' + seconds % 60 + ' sec' : seconds + ' sec '
    },

    async loadAccount () {
      if (!this.account) {
        return
      }

      let contract = this.$store.state.contract
      let acctResponse = await this.$store.state.rpc.get_table_rows({
        code: contract,
        scope: contract,
        table: 'accounts',
        lower_bound: this.account.name,
        limit: 1
      })
      if (acctResponse.rows.length) {
        this.$store.dispatch(Actions.SET_CONTRACT_ACCOUNT, acctResponse.rows[0])
        this.lifetimePixels = acctResponse.rows[0].total_paint_count
        this.setCooldownMessage()
      }
    }

  }
}
</script>

<style scoped>

</style>
