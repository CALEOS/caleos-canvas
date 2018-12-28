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
      class="logged-in-with"
    >
      <button>Logged in as: {{ account.name }}</button>
      <button @click="logout">
        Logout
      </button>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Actions } from '../actions'

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
    }

  }
}
</script>

<style scoped>

</style>
