<template>
  <div id="footer">
    <UserInfo name="user-info" />
    <Coordinates />
    <ColorPaletteContainer
      v-if="account"
      name="color palette container"
    />
    <span
      v-if="account"
      id="pixels-remaining"
      class="white-text"
    >
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
      countColor: 'white-text'
    }
  },
  computed: {
    ...mapState([
      'pixelsRemaining'
    ]),
    account () {
      return this.$store.state.account.accountName
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
.white-text
  color white
.black-text
  color black
.red-text
  color red
</style>
