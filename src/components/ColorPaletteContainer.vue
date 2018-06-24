<template>
  <div id="color-palette-container">
    <h1>Header {{ name }}!</h1>
    <color-button color="white" />
    <color-button color="light-grey" />
    <color-button color="grey" />
    <color-button color="black" />
    <color-button color="pink" />
    <color-button color="red" />
    <color-button color="orange" />
    <color-button color="brown" />
    <color-button color="yellow" />
    <color-button color="lime" />
    <color-button color="green" />
    <color-button color="cyan" />
    <color-button color="blue" />
    <color-button color="dark-blue" />
    <color-button color="magenta" />
    <color-button color="purple" />
  </div>
</template>

<script>
import ColorButton from './ColorButton.vue'

export default {
  components: {
    ColorButton
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
