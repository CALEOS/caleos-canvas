<template>
  <div id="footer">
    <UserInfo name="user-info" />
    <Coordinates />
    <ColorPaletteContainer name="color palette container" />
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
  computed: mapState([
    'pixelsRemaining'
  ])
}
</script>

<style lang="stylus" scoped>
#footer
  background-color blue
#pixels-remaining
  float right
  margin-top -26px
  margin-right 12px
.black-text
  color black
.red-text
  color red
</style>
