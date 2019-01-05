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
    document.getElementById('zoom-canvas').removeEventListener('mousemove', this.getCoordinates)
  },
  mounted () {
    document.getElementById('zoom-canvas').addEventListener('mousemove', this.getCoordinates)
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
      var canvas = document.getElementById('zoom-canvas')
      var pos = this.findPos(canvas)
      this.xCoord = e.pageX - pos.x
      this.yCoord = e.pageY - pos.y
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
