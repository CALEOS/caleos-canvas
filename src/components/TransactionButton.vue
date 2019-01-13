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
import {Actions} from '../actions'
import { mapState } from 'vuex'

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
    ...mapState({
      myScatter: 'scatter'
    }),
    account () {
      if (!this.$store.state.scatter || !this.$store.state.scatter.identity) return null
      return this.$store.state.scatter.identity.accounts[0]
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
        alert('You have not painted any pixels! Select a color and click on the canvas to start painting.')
        return
      }
      this.$root.$emit('send-transaction')
      this.$store.dispatch(Actions.SET_SENDING_TRANSACTION, true)
      await this.$store.state.api.transact({
        actions: [{
          account: this.$store.state.contract,
          name: 'setpixels',
          authorization: [{
            actor: this.account.name,
            permission: 'active'
          }],
          data: {
            account: this.account.name,
            pixels: this.$store.state.pixelCoordArray,
            colors: this.$store.state.intColorArray
          }
        }
        ]}, {
        blocksBehind: 3,
        expireSeconds: 30
      })
      this.$store.dispatch(Actions.CLEAR_PIXEL_ARRAY)
      this.$store.dispatch(Actions.SET_LAST_REFRESH, Date.now())
      this.$store.dispatch(Actions.SET_SENDING_TRANSACTION, false)
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
