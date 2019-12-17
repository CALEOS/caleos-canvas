<template>
  <div id="color-palette-container">
    <Undo name="undo" />
    <ColorButton
      color="c-white"
      hex="#FFFFFF"
      colorint="0"
    />
    <ColorButton
      color="c-lightgrey"
      hex="#D3D3D3"
      colorint="1"
    />
    <ColorButton
      color="c-grey"
      hex="#808080"
      colorint="2"
    />
    <ColorButton
      color="c-black"
      hex="#000000"
      colorint="3"
    />
    <ColorButton
      color="c-pink"
      hex="#FFC0CB"
      colorint="4"
    />
    <ColorButton
      color="c-red"
      hex="#FF0000"
      colorint="5"
    />
    <ColorButton
      color="c-orange"
      hex="#FFA500"
      colorint="6"
    />
    <ColorButton
      color="c-brown"
      hex="#A52A2A"
      colorint="7"
    />
    <ColorButton
      color="c-yellow"
      hex="#FFFF00"
      colorint="8"
    />
    <ColorButton
      color="c-lime"
      hex="#00FF00"
      colorint="9"
    />
    <ColorButton
      color="c-green"
      hex="#008000"
      colorint="10"
    />
    <ColorButton
      color="c-cyan"
      hex="#00FFFF"
      colorint="11"
    />
    <ColorButton
      color="c-blue"
      hex="#0000FF"
      colorint="12"
    />
    <ColorButton
      color="c-darkblue"
      hex="#00008B"
      colorint="13"
    />
    <ColorButton
      color="c-magenta"
      hex="#FF00FF"
      colorint="14"
    />
    <ColorButton
      color="c-purple"
      hex="#800080"
      colorint="15"
    />
    <TransactionButton name="share-square" />
  </div>
</template>

<script>
import Undo from './Undo.vue'
import ColorButton from './ColorButton.vue'
import TransactionButton from './TransactionButton.vue'
import { Actions } from '../actions.js'

export default {
  components: {
    ColorButton,
    TransactionButton,
    Undo
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.$root.$on('cooldown', active => {
      let transactionButton = document.getElementsByName('share-square')
      if (active) {
        transactionButton[0].classList.remove('green-button')
        transactionButton[0].className += ' red-button'
      } else if (active === false) {
        transactionButton[0].classList.remove('red-button')

        transactionButton[0].className += ' green-button'
      } else {
        transactionButton[0].classList.remove('red-button')
        transactionButton[0].classList.remove('green-button')
      }
    })
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
#color-palette-container
  margin auto
  margin-top 2px
  min-width 630px
.c-white
  background-color #FFFFFF
.c-lightgrey
  background-color #D3D3D3
.c-grey
  background-color #808080
.c-black
  background-color #000000
.c-pink
  background-color #FFC0CB
.c-red
  background-color #FF0000
.c-orange
  background-color #FFA500
.c-brown
  background-color #A52A2A
.c-yellow
  background-color #FFFF00
.c-lime
  background-color #00FF00
.c-green
  background-color #008000
.c-cyan
  background-color #00FFFF
.c-blue
  background-color #0000FF
.c-darkblue
  background-color #00008B
.c-magenta
  background-color #FF00FF
.c-purple
  background-color #800080
</style>
