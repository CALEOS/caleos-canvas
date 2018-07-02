<template>
  <div id="color-palette-container">
    <color-button
      color="white"
      hex="#FFFFFF"
    />
    <color-button
      color="light-grey"
      hex="#E4E4E4"
    />
    <color-button
      color="grey"
      hex="#888888"
    />
    <color-button
      color="black"
      hex="#222222"
    />
    <color-button
      color="pink"
      hex="#FFA7D1"
    />
    <color-button
      color="red"
      hex="#E50000"
    />
    <color-button
      color="orange"
      hex="#E59500"
    />
    <color-button
      color="brown"
      hex="#A06A42"
    />
    <color-button
      color="yellow"
      hex="#E5D900"
    />
    <color-button
      color="lime"
      hex="#94E044"
    />
    <color-button
      color="green"
      hex="#02BE01"
    />
    <color-button
      color="cyan"
      hex="#00D3DD"
    />
    <color-button
      color="blue"
      hex="#0083C7"
    />
    <color-button
      color="dark-blue"
      hex="#0000EA"
    />
    <color-button
      color="magenta"
      hex="#CF6EE4"
    />
    <color-button
      color="purple"
      hex="#820080"
    />
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
#color-palette-container
  margin 18px
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
