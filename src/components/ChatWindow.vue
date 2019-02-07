<template>
  <div>
    <VDialog
      width="500"
    >
      <VBtn slot="activator">
        Chat
      </VBtn>
      <div id="chat-window">
        <VList>
          <template v-for="( item, index ) in items">
            <VListTile :key="`chat-${index}`">
              <VListTileAvatar>
                <img :src="item.avatar">
              </VListTileAvatar>

              <VListTileContent>
                <div v-text="item.message" />
              </VListTileContent>
            </VListTile>
          </template>
        </VList>
        <VTextField
          v-model="message"
          clearable
          type="text"
          label="Message"
        />
        <VIcon @click="sendMessage">
          send
        </VIcon>
      </div>
    </VDialog>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'ChatWindow',
  data () {
    return {
      message: '',
      items: []
    }
  },
  computed: {
    ...mapState({
      myChatHistory: 'chatHistory'
    })
  },
  watch: {
    myChatHistory () {
      let chatHistory = []
      this.myChatHistory.forEach((message) => {
        chatHistory.push({
          avatar: require('../assets/michael.png'),
          message: message.message
        })
      })

      this.items = chatHistory
    }
  },
  methods: {
    sendMessage () {
      if (!this.message) { return }

      this.$root.$emit('sendMessage', JSON.stringify({action: 'chat', data: {message: this.message}}))
      this.message = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
#chat-window
  background-color white
</style>
