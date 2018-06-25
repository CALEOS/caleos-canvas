<template>
  <div id="header">
    <toolbox-container name="toolbox container"/>
  </div>
</template>
<script>

import ToolboxContainer from './ToolboxContainer.vue'

export default {
  components: {
    ToolboxContainer
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
