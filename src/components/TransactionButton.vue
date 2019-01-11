<template>
  <div
    class="toolbox-button"
    :name="name"
    @click="sendTransaction()"
  >
    <Icon
      :name="name"
      :scale="2"
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
  methods: {
    async sendTransaction () {
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
.toolbox-button
  box-shadow #999 3px 3px 5px
  border-radius 4px
  border-style solid
  display inline-block
  height 36px
  width 36px
  text-align center
  margin 2px
  &:hover
  &.active
   border 1px #777
   border-style solid
   color #777
   box-shadow black 3px 3px 5px
   cursor pointer
svg
  fill #999
  margin-top 2px
  text-align center
  &:hover
  &.active
   -webkit-filter: invert(100%)
   filter invert(100%)
</style>
