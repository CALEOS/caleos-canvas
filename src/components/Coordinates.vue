<template>
  <div
    id="coordinates"
  >
    X:
    <span id="x-coord">
      {{ xCoord }}
    </span>
    Y:
    <span id="y-coord">
      {{ yCoord }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
  },
  data: function () {
    return {
      xCoord: 0,
      yCoord: 0
    }
  },
  computed: {
  },
  destroyed: function () {
    document.getElementById('place-canvasse').removeEventListener('mousemove', this.getCoordinates)
    document.getElementById('place-canvasse').addEventListener('mouseDown', this.appendCoordArray)
  },
  mounted () {
    document.getElementById('place-canvasse').addEventListener('mousemove', this.getCoordinates)
    document.getElementById('place-canvasse').addEventListener('mouseDown', this.appendCoordArray)
  },
  methods: {
    findPos: function (obj) {
      var curleft = 0; var curtop = 0
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft
          curtop += obj.offsetTop
        } while (obj === obj.offsetParent)
        return { x: curleft, y: curtop }
      }
      return undefined
    },
    getCoordinates: function (e) {
      var canvas = document.getElementById('place-canvasse')
      var pos = this.findPos(canvas)
      this.xCoord = e.pageX - pos.x
      this.yCoord = e.pageY - pos.y
    },
    appendCoordArray: function (e) {
      this.$store.commit('addPixelToArray', {x: this.xCoord, y: this.yCoord})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
