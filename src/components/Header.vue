<template>
  <div id="header">
    <ToolboxContainer name="toolbox container" />
    <LoginLogout name="login-logout" />
    <TestPainter name="test-painter" />
  </div>
</template>
<script>

import ToolboxContainer from './ToolboxContainer.vue'
import LoginLogout from './LoginLogout.vue'
import TestPainter from './TestPainter'

export default {
  components: {
    ToolboxContainer,
    LoginLogout,
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
