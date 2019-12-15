<template>
  <div>
    <VDialog width="500">
      <VBtn slot="activator">
        Paint History
      </VBtn>
      <VDataTable
        :must-sort="true"
        :pagination.sync="pagination"
        :items="paintHistory"
        :headers="headers"
        hide-actions
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td class="text-xs-left">
            <Avatar
              :account-name="props.item.act.data.account_name"
              :avatar-url="props.item.act.data.avatar"
              @click.native="viewAccount(props.item.act.data.account_name)"
            />
            {{ props.item.act.data.account_name }}
          </td>
          <td class="text-xs-left">
            {{ props.item.act.data.pixels.length }}
          </td>
          <td class="text-xs-left">
            <VIcon @click="viewTrx(props.item.trx_id)">
              pageview
            </VIcon>
            {{ props.item.block_num }}
          </td>
        </template>
      </VDataTable>
    </VDialog>
  </div>
</template>

<script>
import { Actions } from '../actions'
import Avatar from './Avatar'

export default {
  name: 'PaintHistory',
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
          text: 'Pixels',
          value: 'pixels'
        },
        {
          text: 'Block',
          value: 'block_num'
        }
      ],
      pagination: {
        descending: true,
        sortBy: 'block',
        rowsPerPage: -1
      }
    }
  },
  computed: {
    paintHistory () {
      return this.$store.state.paintHistory
    }
  },
  mounted () {
    this.$store.dispatch(Actions.LOAD_PAINT_HISTORY)
  },
  methods: {
    viewAccount (accountName) {
      window.open(`https://${process.env.VUE_APP_BLOKS}/account/${accountName}`)
    },
    viewTrx (trxId) {
      window.open(`https://${process.env.VUE_APP_BLOKS}/transaction/${trxId}`)
    }
  }
}
</script>

<style></style>
