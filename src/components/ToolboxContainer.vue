<template>
  <div id="toolbox-container">
    <h1>Toolbox {{ name }}!</h1>
    <toolbox-button name="draw" />
    <toolbox-button name="erase" />
    <toolbox-button name="zin" />
    <toolbox-button name="zout" />
    <toolbox-button name="fit" />
  </div>
</template>

<script>

import ToolboxButton from './ToolboxButton.vue'

export default {
  components: {
    ToolboxButton
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
