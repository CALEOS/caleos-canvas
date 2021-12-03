<template>
  <div
    class="toolbox-button"
    :name="name"
    @click="sendTransaction()"
  >
    <Icon
      :name="name"
      :scale="1.8"
    />
  </div>
</template>

<script>
import 'vue-awesome/icons/share-square'
import Icon from 'vue-awesome/components/Icon.vue'
import { Actions } from '../actions'

export default {
  components: {
    Icon
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    account () {
      return this.$store.state.account.accountName
    }
  },
  mounted () {
    this.$root.$on('trigger-transaction', () => {
      this.sendTransaction()
    })
  },

  methods: {
    async sendTransaction () {
      if (!this.$store.state.pixelCoordArray.length) {
        alert(
          'You have not painted any pixels! Select a color and click on the canvas to start painting.'
        )
        return
      }
      this.$root.$emit('send-transaction')
      this.$store.dispatch(Actions.SET_SENDING_TRANSACTION, true)
      await this.$store['$api'].signTransaction(
        [
          {
            account: this.$store.state.contract,
            name: 'setpixels',
            authorization: [
              {
                actor: this.account,
                permission: 'active'
              }
            ],
            data: {
              account_name: this.account,
              pixels: this.$store.state.pixelCoordArray,
              colors: this.$store.state.intColorArray
            }
          }
        ]
      )
      this.$store.dispatch(Actions.CLEAR_PIXEL_ARRAY)
      this.$store.dispatch(Actions.SET_LAST_REFRESH, Date.now())
      this.$store.dispatch(Actions.SET_SENDING_TRANSACTION, false)
      this.$store.dispatch(Actions.LOAD_CONTRACT_CONFIG)
      this.$store.dispatch(Actions.LOAD_CONTRACT_ACCOUNT)
      this.$store.dispatch(Actions.LOAD_LEADERBOARD)
      // let hyperion index... may take a few seconds
      setTimeout(() => this.$store.dispatch(Actions.LOAD_PAINT_HISTORY), 5000)
    }
  }
}
</script>
<style lang="stylus" scoped>
svg
  fill #999
  margin-bottom 2px
  text-align center
</style>
