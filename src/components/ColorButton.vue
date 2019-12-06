<template>
  <div
    id="color-button"
    :class="[color,{active: isActive}]"
    @click="triggerEvent()"
  >
    <h1 />
  </div>
</template>

<script>
import { Actions } from '../actions'

export default {
  props: {
    color: {
      type: String,
      required: true
    },
    hex: {
      type: String,
      required: true
    },
    colorint: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive: function () {
      return this.color != null ? this.color === this.$store.state.activeColorName : false
    }
  },
  methods: {
    triggerEvent: function (event) {
      if (this.$store.state.activeColorName === this.color) {
        this.$store.dispatch(Actions.SET_ACTIVE_COLOR_NAME, null)
        this.$store.dispatch(Actions.SET_ACTIVE_COLOR_HEX, null)
        this.$store.dispatch(Actions.SET_ACTIVE_COLOR_INT, null)
      } else {
        this.$store.dispatch(Actions.SET_ACTIVE_COLOR_NAME, this.color)
        this.$store.dispatch(Actions.SET_ACTIVE_COLOR_HEX, this.hex)
        this.$store.dispatch(Actions.SET_ACTIVE_COLOR_INT, this.colorint)
        console.log('Color-int: ' + this.$store.state.activeColorInt + '\nColor: ' + this.$store.state.activeColorName + '\nHex: ' + this.$store.state.activeColorHex)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
#color-button
  border-radius 4px
  display inline-block
  margin 5px
  height 30px
  width 30px
  &:hover
  &.active
    border 2px green
    box-shadow black 3px 3px 5px
    border-style solid
    cursor pointer
</style>
