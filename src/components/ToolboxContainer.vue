<template>
  <div
    id="toolbox-container"
    ref="toolbox-container"
    @click="triggerEvent()"
  >
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

export default {
  components: {
    ToolboxButton
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    triggerEvent: function (e) {
      // this.$root.store.setMessageAction('state changed from child component')
      alert('toolbox event triggered')
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    }
  }
}

</script>
<style lang="stylus" scoped>
#toolbox-container
  margin 14px
</style>
