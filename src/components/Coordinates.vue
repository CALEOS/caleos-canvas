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
    findPos: function(obj) {
      var curleft = 0, curtop = 0;
      if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
      }
      return undefined;
    },
    getCoordinates: function (e) {
      var canvas = document.getElementById('place');
      var pos = this.findPos(canvas);
      this.xCoord = e.pageX - pos.x;
      this.yCoord = e.pageY - pos.y;
      // console.log(this.xCoord, this.yCoord)
    },
    appendCoordArray: function (e) {
      this.$store.commit('setActiveTool', {x: this.xCoord, y: this.yCoord})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
