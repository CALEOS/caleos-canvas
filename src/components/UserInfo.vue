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

export default {
  data () {
    return {
      lifetimePixels: null
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
  computed: {
    ...mapState({
      myScatter: 'scatter',
      myLastRefresh: 'lastRefresh',
      myIdentity: 'identity',
      mySendingTransaction: 'sendingTransaction'
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
      this.loadAccount()
    },

    async loadAccount () {
      if (!this.account) {
        return
      }

      let contract = this.$store.state.contract
      let acctRows = await this.$store.state.rpc.get_table_rows({
        code: contract,
        scope: contract,
        table: 'accounts',
        lower_bound: this.account.name,
        limit: 1
      })
      if (acctRows.rows.length) {
        this.lifetimePixels = acctRows.rows[0].total_paint_count
      }
    }

  }
}
</script>

<style scoped>

</style>
