<template>
  <div id="footer">
    <color-palette-container name="color palette container" />
    <coordinates/>
  </div>
</template>

<script>
import ColorPaletteContainer from './ColorPaletteContainer.vue'
import Coordinates from './Coordinates.vue'

export default {
  components: {
    ColorPaletteContainer,
    Coordinates
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
#footer
  border-top 1px solid #999
</style>
