<template>
  <div
    v-if="myScatter && account"
    class="test-painter"
  >
    <Coordinates />
  </div>
</template>

<script>
/* eslint-disable no-debugger */

import { mapState } from 'vuex'
import {Actions} from '../actions'
import Coordinates from './Coordinates.vue'

export default {
  components: {
    Coordinates
  },
  data: function () {
    return {
      x: null,
      y: null
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
    this.$root.$on('send-transaction', () => {
      this.paintMultiplePixels()
    })
  },
  methods: {
    async paintMultiplePixels () {
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

<style scoped>

</style>
