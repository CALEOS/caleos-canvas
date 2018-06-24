<template>
  <div id="toolbox-button">
    <icon
      :name="name"
      :scale="2"
    />
  </div>
</template>

<script>

import 'vue-awesome/icons/expand'
import 'vue-awesome/icons/arrows-alt'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/eraser'
import 'vue-awesome/icons/search-plus'
import 'vue-awesome/icons/search-minus'

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
