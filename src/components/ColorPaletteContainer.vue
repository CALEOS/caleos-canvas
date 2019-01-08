<template>
  <div id="color-palette-container">
    <ColorButton
      color="white"
      hex="#FFFFFF"
      colorint="0"
    />
    <ColorButton
      color="light-grey"
      hex="#E4E4E4"
      colorint="1"
    />
    <ColorButton
      color="grey"
      hex="#888888"
      colorint="2"
    />
    <ColorButton
      color="black"
      hex="#222222"
      colorint="3"
    />
    <ColorButton
      color="pink"
      hex="#FFA7D1"
      colorint="4"
    />
    <ColorButton
      color="red"
      hex="#E50000"
      colorint="5"
    />
    <ColorButton
      color="orange"
      hex="#E59500"
      colorint="6"
    />
    <ColorButton
      color="brown"
      hex="#A06A42"
      colorint="7"
    />
    <ColorButton
      color="yellow"
      hex="#E5D900"
      colorint="8"
    />
    <ColorButton
      color="lime"
      hex="#94E044"
      colorint="9"
    />
    <ColorButton
      color="green"
      hex="#02BE01"
      colorint="10"
    />
    <ColorButton
      color="cyan"
      hex="#00D3DD"
      colorint="11"
    />
    <ColorButton
      color="blue"
      hex="#0083C7"
      colorint="12"
    />
    <ColorButton
      color="dark-blue"
      hex="#0000EA"
      colorint="13"
    />
    <ColorButton
      color="magenta"
      hex="#CF6EE4"
      colorint="14"
    />
    <ColorButton
      color="purple"
      hex="#820080"
      colorint="15"
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
  margin auto
  min-width 300px
  max-width 550px
  margin-top 4px
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
