<template>
  <div
    id="toolbox-container"
    ref="toolbox-container"
    @click="triggerEvent()"
  >
    <ToolboxButton name="paint-brush" />
    <ToolboxButton name="eraser" />
    <ToolboxButton name="expand" />
    <ToolboxButton name="hand-grab-o" />
    <ToolboxButton name="trash" />
    <ToolboxButton name="search-plus" />
    <ToolboxButton name="search-minus" />
    <ToolboxButton name="share-square" />
  </div>
</template>

<script>
import { Actions } from '../actions.js'
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
      this.$store.dispatch(Actions.INCREMENT)
      console.log(this.$store.state.count)
    }
  }
}

</script>
<style lang="stylus" scoped>
#toolbox-container
  margin auto
  width 324px
</style>
