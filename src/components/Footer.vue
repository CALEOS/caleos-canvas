<template>
  <div id="footer">
    <UserInfo name="user-info" />
    <Coordinates />
    <ColorPaletteContainer v-if="account" name="color palette container" />
    <span id="pixels-remaining">
      Remaining Session Pixels:<b :class="countColor">
        {{ pixelsRemaining }}
      </b>
    </span>
  </div>
</template>

<script>
import UserInfo from './UserInfo.vue'
import Coordinates from './Coordinates.vue'
import ColorPaletteContainer from './ColorPaletteContainer.vue'
import { mapState } from 'vuex'
import { debug } from 'util'

export default {
  components: {
    UserInfo,
    Coordinates,
    ColorPaletteContainer
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      countColor: 'black-text'
    }
  },
  computed: {
    ...mapState([
      'pixelsRemaining'
    ]),
    account() {
    if (!this.$store.state.scatter || !this.$store.state.scatter.identity)
      return null;
    return this.$store.state.scatter.identity.accounts[0];
    }
  }
}
</script>

<style lang="stylus" scoped>
#footer
  background-color #4f2ef5
#pixels-remaining
  float right
  margin-top -26px
  margin-right 12px
.black-text
  color black
.red-text
  color red
</style>
