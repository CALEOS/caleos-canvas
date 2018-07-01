<template>
  <div
    id="place"
    class="place"
  >
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
    this.$canvasse = new Canvasse(document.getElementById('place-canvasse'))

    let zoomScript = document.createElement('script')
    zoomScript.setAttribute('src', 'src/js/zoom.js')
    document.head.appendChild(zoomScript)
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
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
