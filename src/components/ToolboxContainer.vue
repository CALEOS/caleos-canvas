<template>
  <div id="toolbox-container">
    <h1>{{ name }}</h1>
    <icon name="camera" />
    <toolbox-button name="draw" />
    <toolbox-button name="erase" />
    <toolbox-button name="zin" />
    <toolbox-button name="zout" />
    <toolbox-button name="fit" />
  </div>
</template>

<script>

import ToolboxButton from './ToolboxButton.vue'
import 'vue-awesome/icons/camera'
import Icon from 'vue-awesome/components/Icon.vue'

export default {
  components: {
    ToolboxButton,
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

</style>
