<template>
  <div v-if="myScatter && account">
    <button
      @click="paint"
    >
      Paint Pixels
    </button>
    <label for="x-axis">
      X
    </label>
    <input
      id="x-axis"
      v-model="x"
    >
    <label for="y-axis">
      Y
    </label>
    <input
      id="y-axis"
      v-model="y"
    >
  </div>
</template>

<script>
/* eslint-disable no-debugger */

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      myScatter: 'scatter'
    }),
    account () {
      if (!this.$store.state.scatter || !this.$store.state.scatter.identity) return null
      return this.$store.state.scatter.identity.accounts[0]
    }

  },
  data: function () {
    return {
      x: null,
      y: null
    }
  },
  methods: {
    paint () {
      let color = this.$store.state.activeColorInt
      let x = parseInt(this.x, 10)
      let y = parseInt(this.y, 10)
      this.$store.state.api.transact({
        actions: [{
          account: this.$store.state.contract,
          name: 'setpixel',
          authorization: [{
            actor: this.account.name,
            permission: 'active'
          }],
          data: {
            account: this.account.name,
            pixel: (y * 1000) + x,
            color: color
          }
        }
        ]}, {
        blocksBehind: 3,
        expireSeconds: 30
      })
    }
  }
}
</script>

<style scoped>

</style>
