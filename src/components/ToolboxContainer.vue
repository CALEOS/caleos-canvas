<template>
  <div id="toolbox-container">
    <toolbox-button name="expand" />
    <toolbox-button name="arrows-alt" />
    <toolbox-button name="pencil" />
    <toolbox-button name="eraser" />
    <toolbox-button name="search-plus" />
    <toolbox-button name="search-minus" />
  </div>
</template>

<script>

import ToolboxButton from './ToolboxButton.vue'
// import 'vue-awesome/icons/camera'
// import Icon from 'vue-awesome/components/Icon.vue'

export default {
  components: {
    ToolboxButton // ,
    // Icon
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
