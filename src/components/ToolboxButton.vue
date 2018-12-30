<template>
  <div
    id="toolbox-button"
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
import 'vue-awesome/icons/arrows-alt'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/eraser'
import 'vue-awesome/icons/search-plus'
import 'vue-awesome/icons/search-minus'
import 'vue-awesome/icons/trash'

import Icon from 'vue-awesome/components/Icon.vue'

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
      if (this.$store.state.activeTool === this.name) {
        this.$store.commit('setActiveTool', null)
      } else {
        this.$store.commit('setActiveTool', this.name)
      }
      switch (this.name) {
        case 'trash':
          this.$store.commit('clearPixelArray')
          console.log('clearing draw canvas')
          break
        case 'pencil':
          console.log('draw pixels')
          break
        case 'eraser':
          console.log('erase pixels')
          break
        case 'search-plus':
          console.log('zoom in')
          break
        case 'search-minus':
          console.log('zoom out')
          break
        case 'expand':
          console.log('fit to screen')
          break
        case 'arrows-alt':
          console.log('full screen')
          break
        default:
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
#toolbox-button
  border 1px #999
  border-radius 4px
  border-style solid
  display inline-block
  height 36px
  width 36px
  text-align center
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
