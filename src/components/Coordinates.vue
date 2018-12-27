<template>
  <div
    id="coordinates"
  >
    X:
    <span id="x-coord">{{ xCoord }}</span>
    Y:
    <span id="y-coord">{{ yCoord }}</span>
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
    document.getElementById('place').removeEventListener('mousemove', this.getCoordinates)
    document.getElementById('place').addEventListener('mouseDown', this.appendCoordArray)
  },
  mounted () {
    document.getElementById('place').addEventListener('mousemove', this.getCoordinates)
    document.getElementById('place').addEventListener('mouseDown', this.appendCoordArray)
  },
  methods: {
    getCoordinates: function (e) {
      this.xCoord = e.pageX
      this.yCoord = e.pageY
      console.log(this.xCoord, this.yCoord)
    },
    appendCoordArray: function (e) {
      this.$store.commit('setActiveTool', {x: this.xCoord, y: this.yCoord})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
