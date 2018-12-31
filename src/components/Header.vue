<template>
  <div id="header">
    <ToolboxContainer name="toolbox container" />
    <UserInfo name="user-info" />
    <TestPainter name="test-painter" />
  </div>
</template>
<script>

import ToolboxContainer from './ToolboxContainer.vue'
import UserInfo from './UserInfo.vue'
import TestPainter from './TestPainter'

export default {
  components: {
    ToolboxContainer,
    UserInfo,
    TestPainter
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
