<template>
  <div>
    <VDialog width="500">
      <VBtn slot="activator">
        Leaderboard
      </VBtn>
      <div class="scores">
        <p
          v-if="account"
          class="text-md-center"
        >
          Your paint score - {{ currentAccount.paint_score }}
        </p>
        <p class="text-md-center">
          Global paint score - {{ config.global_paint_score }}
        </p>
      </div>
      <VDataTable
        :must-sort="true"
        :pagination.sync="pagination"
        :items="leaders"
        :headers="headers"
        hide-actions
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td class="text-xs-left">
            <Avatar
              :account-name="props.item.account_name"
              :avatar-url="props.item.avatar"
              @click.native="viewAccount(props.item.account_name)"
            />
            {{ props.item.account_name }}
          </td>
          <td class="text-xs-left">
            {{ props.item.paint_score }}
          </td>
        </template>
      </VDataTable>
    </VDialog>
  </div>
</template>

<script>
import Avatar from './Avatar'
import { mapState } from 'vuex'
export default {
  name: 'Leaderboard',
  components: { Avatar },
  data () {
    return {
      headers: [
        {
          text: 'Account',
          align: 'left',
          value: 'account_name'
        },
        {
          text: 'Paint Count',
          value: 'paint_score'
        }
      ],
      pagination: {
        descending: true,
        sortBy: 'paint_score',
        rowsPerPage: -1
      }
    }
  },
  computed: {
    ...mapState({
      config: 'config',
      currentAccount: 'contractAccount'
    }),
    leaders () {
      return this.$store.state.leaderboard
    },
    account () {
      return !this.$store.state.scatter || !this.$store.state.scatter.identity
        ? null
        : this.$store.state.scatter.identity.accounts[0]
    }
  },
  methods: {
    viewAccount (accountName) {
      window.open(`https://${process.env.VUE_APP_BLOKS}/account/${accountName}`)
    }
  }
}
</script>

<style lang="stylus" scoped>

.scores
  padding-top 10px

</style>
