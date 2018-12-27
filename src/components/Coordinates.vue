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
  mounted () {
    window.addEventListener('mousemove', this.getCoordinates)
  },
  destroyed: function () {
    window.removeEventListener('mousemove', this.getCoordinates)
  },
  methods: {
    getCoordinates: function (e) {
      this.xCoord = e.pageX
      this.yCoord = e.pageY
      console.log(this.xCoord, this.yCoord)
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
