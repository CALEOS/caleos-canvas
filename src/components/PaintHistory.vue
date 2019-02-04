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
          <td
            class="text-xs-left"
          >
            <VIcon
              @click="viewAccount(props.item.account)"
            >
              pageview
            </VIcon>
            {{ props.item.account }}
          </td>
          <td class="text-xs-left">
            {{ props.item.pixels }}
          </td>
          <td class="text-xs-left">
            {{ props.item.indexState.blockNumber }}
          </td>
        </template>
      </VDataTable>
    </VDialog>
  </div>
</template>

<script>
export default {
  name: 'PaintHistory',
  data () {
    return {
      headers: [{
        text: 'Account',
        align: 'left',
        value: 'account'
      }, {
        text: 'Pixels',
        value: 'pixels'
      }, {
        text: 'Block',
        value: 'indexState.blockNum'
      }],
      pagination: {
        descending: true,
        sortBy: 'indexState.blockNum',
        rowsPerPage: -1
      }
    }
  },
  computed: {
    paintHistory () {
      return this.$store.state.paintHistory
    }
  },
  methods: {
    viewAccount (accountName) {
      window.open('https://telos.eosx.io/account/' + accountName)
    }
  }
}
</script>

<style>
</style>
