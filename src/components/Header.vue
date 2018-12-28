<template>
  <div id="header">
    <ToolboxContainer name="toolbox container" />
    <LoginLogout name="login-logout" />
  </div>
</template>
<script>

import ToolboxContainer from './ToolboxContainer.vue'
import LoginLogout from './LoginLogout.vue'

export default {
  components: {
    ToolboxContainer,
    LoginLogout
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
