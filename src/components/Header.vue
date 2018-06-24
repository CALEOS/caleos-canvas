<template>
  <div id="header">
    <h1>Header {{ name }}!</h1>
    <toolbox-container name="toolbox test"/>
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
