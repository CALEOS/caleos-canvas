<template>
  <div
    id="toolbox-container"
    ref="toolbox-container"
    @click="triggerEvent()"
  >
    <ToolboxButton name="expand" />
    <ToolboxButton name="arrows-alt" />
    <ToolboxButton name="pencil" />
    <ToolboxButton name="eraser" />
    <ToolboxButton name="search-plus" />
    <ToolboxButton name="search-minus" />
    <ToolboxButton name="trash" />
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
