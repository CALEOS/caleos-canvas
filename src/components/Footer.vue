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
      pixelsRemaining: 10,
      countColor: 'black-text'
    }
  },
  mounted () {
    this.$root.$on('update-canvas', (pixelArray) => {
      this.getRemaining(pixelArray.length)
    })
  },
  methods: {
    getRemaining: function (pixelCount) {
      this.pixelsRemaining = this.$store.state.config.pixels_per_paint - pixelCount
      this.pixelsRemaining === 0 ? this.countColor = 'red-text' : this.countColor = 'black-text'
    }
  }
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
