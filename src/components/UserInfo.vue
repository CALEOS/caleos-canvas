<template>
  <div class="info-block">
    <VBtn
      v-if="myScatter && !account"
      class="login"
      @click="login"
    >
      <img
        height="40px"
        src="../assets/sqrl.png"
      >
      <div>or</div>
      <img
        height="40px"
        src="../assets/scatter.png"
      >
    </VBtn>
    <span
      v-if="myScatter && account"
      class="user-info"
    >
      <VBtn @click="logout">Logout {{ account.name }}</VBtn>
    </span>
    <!-- commenting out for now, can add back later -->
    <!-- <span class="cooldown-div">
      <span v-if="myScatter && account">
        Lifetime paint actions: {{ lifetimePixels }}
      </span>

    </span>-->
    <span
      v-if="cooldownMessage && myScatter && account && !mySendingTransaction"
      class="white-text message-span"
    >{{ cooldownMessage }}</span>
    <span
      v-if="mySendingTransaction"
      class="white-text message-span"
    >Sending transaction...</span>
  </div>
</template>

<script>
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
      myContractConfig: 'config',
      myContractAccount: 'contractAccount'
    }),
    account () {
      if (!this.$store.state.scatter || !this.$store.state.scatter.identity) {
        return null
      }
      return this.$store.state.scatter.identity.accounts[0]
    }
  },
  watch: {
    myLastRefresh () {
      this.loadAccount()
    },
    myIdentity () {
      this.loadAccount()
    },
    myContractAccount () {
      this.loadContractAccount()
    }
  },
  mounted () {
    this.loadAccount()
  },
  methods: {
    async login () {
      await this.$store.state.scatter
        .getIdentity({ accounts: [this.$store.state.network] })
        .catch(async err => {
          if (err.code === 402 && err.type === 'no_network') {
            await this.$store.state.scatter.suggestNetwork(
              this.$store.state.network
            )
          }
          this.loadIdentity()
        })
    },

    async logout () {
      await this.$store.state.scatter.forgetIdentity()
      this.loadIdentity()
    },

    loadIdentity () {
      this.$store.dispatch(
        Actions.SET_IDENTITY,
        this.$store.state.scatter.identity
      )
      this.loadAccount()
    },

    setCooldownMessage () {
      if (!this.$store.state.config) {
        return
      }

      let cooldown = this.$store.state.config.settings.find(
        setting => setting.key === 'cooldown'
      ).value

      if (cooldown === 0) {
        this.cooldownInterval = null
        this.cooldownMessage = 'No cooldown, party mode 🎉'
        return
      }

      let friendlyCooldown = this.makeFriendlyDuration(cooldown)

      if (!this.$store.state.contractAccount) {
        this.cooldownInterval = null
        this.cooldownMessage = `The cooldown is ${friendlyCooldown}`
        return
      }

      const lastActivitySeconds = moment
        .utc(this.$store.state.contractAccount.last_activity)
        .unix()
      let cooldownExpires = moment.unix(lastActivitySeconds + cooldown)
      if (cooldownExpires.isBefore()) {
        if (this.$store.state.pixelCoordArray.length) {
          this.$root.$emit('cooldown', false)
        } else {
          this.$root.$emit('cooldown')
        }
        this.cooldownInterval = null
        this.cooldownMessage = 'Ready to paint!'
      } else {
        this.$root.$emit('cooldown', true)
        this.cooldownMessage = `Cooldown expires in ${cooldownExpires
          .countdown()
          .toString()}...`
        if (!this.cooldownInterval) {
          this.cooldownInterval = setInterval(this.setCooldownMessage, 1000)
        }
      }
    },

    makeFriendlyDuration (seconds) {
      return seconds > 60
        ? Math.floor(seconds / 60) + ' min ' + (seconds % 60) + ' sec'
        : seconds + ' sec '
    },

    async loadAccount () {
      if (!this.account) {
        return
      }

      await this.$store.dispatch(Actions.LOAD_CONTRACT_ACCOUNT)
    },
    async loadContractAccount () {
      if (!this.$store.state.contractAccount) {
        return
      }

      this.lifetimePixels = this.$store.state.contractAccount.total_paint_count
      this.setCooldownMessage()
    }
  }
}
</script>

<style lang="stylus" scoped></style>
