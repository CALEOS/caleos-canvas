<template>
  <div class="info-block">
    <!-- commenting out for now, can add back later -->
    <!-- <span class="cooldown-div">
      <span v-if="isAuthenticated">
        Lifetime paint actions: {{ lifetimePixels }}
      </span>

    </span>-->
    <span
      v-if="cooldownMessage && isAuthenticated && !mySendingTransaction"
      class="white-text message-span"
    >{{ cooldownMessage }}</span>
    <span
      v-if="mySendingTransaction"
      class="white-text message-span"
    >Sending transaction...</span>
  </div>
</template>

<script>
import {mapState} from 'vuex'
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
      myLastRefresh: 'lastRefresh',
      mySendingTransaction: 'sendingTransaction',
      myContractConfig: 'config',
      myContractAccount: 'contractAccount'
    }),
    account () {
      return this.$store.state.account.accountName
    },
    isAuthenticated () {
      return !!this.$store.state.account.accountName
    }
  },
  watch: {
    myLastRefresh () {
      this.loadContractAccount()
    },
    isAuthenticated () {
      console.log('IS AUTHENTICATED CHANGED')
      this.loadContractAccount()
    },
    myContractAccount () {
      this.loadContractAccount()
    }
  },
  mounted () {
    this.loadContractAccount()
  },
  methods: {
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
