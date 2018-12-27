<template>
  <div
    id="place"
    class="place">
    <h1>TESTING</h1>
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
      let rect = canvasElement.getBoundingClientRect()
      let pixelObj = {
        x: event.clientX - rect.left,
        y: Math.floor(event.clientY - rect.top)
      }
      this.addPixelToPaintSession(pixelObj)
      console.log('x: ' + pixelObj.x + ' y: ' + pixelObj.y)
    },
    addPixelToPaintSession: function (pixelObj) {
      this.$store.commit('addPixelToArray', pixelObj)
      console.dir(this.$store.state.pixelCoordArray)
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
