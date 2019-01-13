<template>
  <div id="color-palette-container">
    <ColorButton
      color="white"
      hex="#FFFFFF"
      colorint="0"
    />
    <ColorButton
      color="lightgrey"
      hex="#D3D3D3"
      colorint="1"
    />
    <ColorButton
      color="grey"
      hex="#808080"
      colorint="2"
    />
    <ColorButton
      color="black"
      hex="#000000"
      colorint="3"
    />
    <ColorButton
      color="pink"
      hex="#FFC0CB"
      colorint="4"
    />
    <ColorButton
      color="red"
      hex="#FF0000"
      colorint="5"
    />
    <ColorButton
      color="orange"
      hex="#FFA500"
      colorint="6"
    />
    <ColorButton
      color="brown"
      hex="#A52A2A"
      colorint="7"
    />
    <ColorButton
      color="yellow"
      hex="#FFFF00"
      colorint="8"
    />
    <ColorButton
      color="lime"
      hex="#00FF00"
      colorint="9"
    />
    <ColorButton
      color="green"
      hex="#008000"
      colorint="10"
    />
    <ColorButton
      color="cyan"
      hex="#00FFFF"
      colorint="11"
    />
    <ColorButton
      color="blue"
      hex="#0000FF"
      colorint="12"
    />
    <ColorButton
      color="darkblue"
      hex="#00008B"
      colorint="13"
    />
    <ColorButton
      color="magenta"
      hex="#FF00FF"
      colorint="14"
    />
    <ColorButton
      color="purple"
      hex="#800080"
      colorint="15"
    />
    <TransactionButton name="share-square" />
  </div>
</template>

<script>
import ColorButton from './ColorButton.vue'
import TransactionButton from './TransactionButton.vue'
import { Actions } from '../actions.js'

export default {
  components: {
    ColorButton,
    TransactionButton
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.$root.$on('cooldown', (active) => {
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
  min-width 600px
  max-width 550px
.white
  background-color #FFFFFF
.lightgrey
  background-color #D3D3D3
.grey
  background-color #808080
.black
  background-color #000000
.pink
  background-color #FFC0CB
.red
  background-color #FF0000
.orange
  background-color #FFA500
.brown
  background-color #A52A2A
.yellow
  background-color #FFFF00
.lime
  background-color #00FF00
.green
  background-color #008000
.cyan
  background-color #00FFFF
.blue
  background-color #0000FF
.darkblue
  background-color #00008B
.magenta
  background-color #FF00FF
.purple
  background-color #800080

</style>
