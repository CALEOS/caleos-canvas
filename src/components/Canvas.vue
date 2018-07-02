<template>
  <div
    id="place"
    class="place">
    <h1>Place{{ $place.placeTest() }}!</h1>

    <canvas
      id="place-canvasse"
      class="place-canvas"
    />

    <canvas id="zoom-canvas"/>
  </div>
</template>

<script>
import Canvasse from '../js/Canvasse'

export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  mounted: function () {
    let canvasElement = document.getElementById('place-canvasse')
    this.$canvasse = new Canvasse(canvasElement)

    let zoomScript = document.createElement('script')
    zoomScript.setAttribute('src', 'src/js/zoom.js')
    document.head.appendChild(zoomScript)
    canvasElement.addEventListener('click', this.getPixelCoord)
  },
  methods: {
    refreshCanvas: function () {
      if (this.$store.state.reloading) {
        console.log('Skipping reload')
        return
      }
      console.log('Reloading Canvas')
      this.$store.commit('setReloading', true)
      this.$place.getPixelsRaw(function (canvas) {
        this.$canvasse.setBufferFromRawArray(canvas)
        this.$store.commit('setReloading', false)
      })
    },
    getPixelCoord: function (event) {
      let canvasElement = document.getElementById('place-canvasse')
      var rect = canvasElement.getBoundingClientRect()
      var x = event.clientX - rect.left
      var y = event.clientY - rect.top
      console.log('x: ' + x + ' y: ' + y)
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
