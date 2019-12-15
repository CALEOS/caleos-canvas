<template>
  <div>
    <VDialog width="500">
      <VBtn slot="activator">
        Leaderboard
      </VBtn>
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
    leaders () {
      return this.$store.state.leaderboard
    }
  },
  methods: {
    viewAccount (accountName) {
      window.open(`https://${process.env.VUE_APP_BLOKS}/account/${accountName}`)
    }
  }
}
</script>

<style></style>
