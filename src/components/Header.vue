<template>
  <div id="header">
    <Leaderboard />
  </div>
</template>
<script>

import Leaderboard from './Leaderboard'
export default {
  components: {
    Leaderboard
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
