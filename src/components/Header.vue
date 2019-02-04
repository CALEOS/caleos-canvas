<template>
  <div id="header">
    <Leaderboard align="left" />
    <PaintHistory align="right" />
  </div>
</template>
<script>

import Leaderboard from './Leaderboard'
import PaintHistory from './PaintHistory'
export default {
  components: {
    Leaderboard,
    PaintHistory
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
