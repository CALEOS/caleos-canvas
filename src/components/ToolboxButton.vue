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
  height 30px
  width 30px
  display inline-block
</style>
