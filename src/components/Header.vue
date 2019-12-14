<template>
  <div id="header">
    <Leaderboard class="header-item header-left" />
    <PaintHistory class="header-item header-right" />
    <div class="header-logo-container">
      <img
        class="header-logo"
        src="../../static/img/telos-logo-white.png"
      >
    </div>
  </div>
</template>
<script>
import Leaderboard from './Leaderboard'
import PaintHistory from './PaintHistory'
// <ChatWindow class="header-item header-center" />
// import ChatWindow from '@/components/ChatWindow'
export default {
  components: {
    Leaderboard,
    PaintHistory /*,
    ChatWindow */
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
  background-color #4f2ef5
  white-space nowrap
  height 45px
.header-logo-container
  text-align center
.header-logo
  padding-top 4px
  text-align center
  height 37px
.header-item
  display inline-block
.header-left
  float left
.header-right
  float right
</style>
