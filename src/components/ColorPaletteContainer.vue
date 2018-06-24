<template>
  <div id="color-palette-container">
    <h1>{{ name }}</h1>
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
.white
  background-color #FFFFFF
.light-grey
  background-color #E4E4E4
.grey
  background-color #888888
.black
  background-color #222222
.pink
  background-color #FFA7D1
.red
  background-color #E50000
.orange
  background-color #E59500
.brown
  background-color #A06A42
.yellow
  background-color #E5D900
.lime
  background-color #94E044
.green
  background-color #02BE01
.cyan
  background-color #00D3DD
.blue
  background-color #0083C7
.dark-blue
  background-color #0000EA
.magenta
  background-color #CF6EE4
.purple
  background-color #820080
</style>
