<template>
  <div>
    <div
      v-if="!isAuthenticated"
      class="q-px-md"
    >
      <v-btn
        class="black--text"
        color="secondary"
        @click="showLogin = true"
      >
        Login
      </v-btn>
    </div>
    <div
      v-if="isAuthenticated"
      class="q-px-md row"
    >
      <div
        class="account-name q-px-md"
        @click="goToAccountPage"
      >
        {{ accountName }}
      </div>
      <v-btn
        class="black--text"
        color="secondary"
        @click="logout"
      >
        Logout
      </v-btn>
    </div>
    <v-dialog v-model="showLogin">
      <v-card
        class="mx-auto"
        max-width="400"
        tile
      >
        <v-list>
          <v-subheader>Wallets</v-subheader>
          <v-list-tile
            v-for="(wallet, idx) in $ual.authenticators"
            :key="wallet.getStyle().text"
            ripple
            :style="{
              background: wallet.getStyle().background,
              color: wallet.getStyle().textColor
            }"
          >
            <v-list-tile-action
              class="cursor-pointer"
              avatar
              @click="onLogin(idx)"
            >
              <img
                :src="wallet.getStyle().icon"
                width="30"
              >
            </v-list-tile-action>
            <v-list-tile-content
              class="cursor-pointer"
              @click="onLogin(idx)"
            >
              {{ wallet.getStyle().text }}
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return { showLogin: false, error: null }
  },
  computed: {
    ...mapGetters('account', [
      'isAuthenticated',
      'accountName',
      'loading',
      'isAutoLoading'
    ])
  },
  async mounted () {
    await this.autoLogin()
  },
  methods: {
    ...mapActions('account', ['login', 'logout', 'autoLogin']),
    async onLogin (idx) {
      this.error = null
      const error = await this.login({ idx })
      if (!error) {
        this.showLogin = false
      } else {
        this.error = error
      }
    },
    openUrl (url) {
      window.open(url)
    },
    goToAccountPage () {
      const accountPath = `https://${process.env.VUE_APP_BLOKS}/account/${this.accountName}`
      window.open(accountPath, '_blank')
    }
  }
}
</script>

<style scoped>
.account-name {
  color: white;
  font-size: 20px;
}
</style>
