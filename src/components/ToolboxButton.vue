<template>
  <div
    class="toolbox-button"
    :class="{active: isActive}"
    :name="name"
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
  box-shadow #999 3px 3px 5px
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
   box-shadow black 3px 3px 5px
   cursor pointer
svg
  fill #999
  margin-top 2px
  text-align center
  &:hover
  &.active
   -webkit-filter: invert(100%)
   filter invert(100%)
</style>
