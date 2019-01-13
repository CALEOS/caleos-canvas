<template>
  <div id="footer">
    <UserInfo name="user-info" />
    <Coordinates />
    <ColorPaletteContainer name="color palette container" />
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
  }
}
</script>

<style lang="stylus" scoped>
#footer
  // border-top 1px solid #999
</style>
