<template>
  <div id="footer">
    <h1>Footer {{ name }}</h1>
    <color-palette-container name="color palette" />
  </div>
</template>

<script>
import ColorPaletteContainer from './ColorPaletteContainer.vue'

export default {
  components: {
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

</style>
