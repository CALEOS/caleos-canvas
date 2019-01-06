<template>
  <div
    class="toolbox-button"
    :class="{active: isActive}"
    @click="selectTool()"
  >
    <Icon
      :name="name"
      :scale="2"
    />
  </div>
</template>

<script>

// import only nec icons
import 'vue-awesome/icons/expand'
import 'vue-awesome/icons/hand-grab-o'
import 'vue-awesome/icons/paint-brush'
import 'vue-awesome/icons/eraser'
import 'vue-awesome/icons/search-plus'
import 'vue-awesome/icons/search-minus'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/share-square'

import Icon from 'vue-awesome/components/Icon.vue'
import { Actions } from '../actions.js'

export default {
  components: {
    Icon
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive: function () { return this.name != null ? this.name === this.$store.state.activeTool : false }
  },
  methods: {
    selectTool: function (event) {
      let toggleActive = () => {
        if (this.$store.state.activeTool === this.name) {
          this.$store.dispatch(Actions.SET_ACTIVE_TOOL, null)
        } else {
          this.$store.dispatch(Actions.SET_ACTIVE_TOOL, this.name)
        }
      }
      switch (this.name) {
        case 'trash':
          this.$store.dispatch(Actions.CLEAR_PIXEL_ARRAY)
          this.$root.$emit('fit-screen', true)
          console.log('clearing draw canvas')
          break
        case 'paint-brush':
          toggleActive()
          this.$root.$emit('cursor', 'paint')
          if (this.$store.state.activeColorInt === null) {
            this.$store.dispatch(Actions.SET_ACTIVE_COLOR_NAME, 'black')
            this.$store.dispatch(Actions.SET_ACTIVE_COLOR_HEX, '#222222')
            this.$store.dispatch(Actions.SET_ACTIVE_COLOR_INT, '3')
          }
          console.log('draw pixels')
          break
        case 'eraser':
          toggleActive()
          this.$root.$emit('cursor', 'eraser')
          console.log('erase pixels')
          break
        case 'search-plus':
          this.$root.$emit('zoom-in')
          console.log('zoom in')
          break
        case 'search-minus':
          this.$root.$emit('zoom-out')
          console.log('zoom out')
          break
        case 'expand':
          this.$root.$emit('fit-screen')
          console.log('fit to screen')
          break
        case 'hand-grab-o':
          toggleActive()
          this.$root.$emit('cursor', 'explore-canvas')
          console.log('full screen')
          break
        case 'share-square':
          this.$root.$emit('send-transaction')
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.toolbox-button
  border 1px #999
  border-radius 4px
  border-style solid
  display inline-block
  height 36px
  width 36px
  text-align center
  margin 2px
  &:hover
  &.active
    border 1px #777
    border-style solid
    color #777
    -webkit-filter: invert(100%)
    filter invert(100%)
    cursor pointer
svg
  fill #999
  margin-top 2px
  text-align center
</style>
