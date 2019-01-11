<template>
  <div id="footer">
    <Coordinates />
    <ColorPaletteContainer name="color palette container" />
  </div>
</template>

<script>
import Coordinates from './Coordinates.vue'
import ColorPaletteContainer from './ColorPaletteContainer.vue'

export default {
  components: {
    Coordinates,
    ColorPaletteContainer
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
  // border-top 1px solid #999
</style>
