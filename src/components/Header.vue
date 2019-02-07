<template>
  <div id="header">
    <Leaderboard align="left" />
    <ChatWindow align="center" />
    <PaintHistory align="right" />
  </div>
</template>
<script>

import Leaderboard from './Leaderboard'
import PaintHistory from './PaintHistory'
import ChatWindow from '@/components/ChatWindow'
export default {
  components: {
    Leaderboard,
    PaintHistory,
    ChatWindow
  },
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>
#header
  background-color blue
</style>
