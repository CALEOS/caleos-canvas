<template>
  <div
    id="place"
    class="place"
  >
    <canvas
      id="place-canvasse"
      class="place-canvas"
    />

    <canvas id="zoom-canvas" />
  </div>
</template>

<script>

import Canvasse from '../js/Canvasse'
import { RpcError } from 'eosjs'
import { Actions } from '../actions'
import { mapState } from 'vuex'
// import Zoom from '../js/zoom'

export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState({
      myHeight: 'height',
      myWidth: 'width',
      myRpc: 'rpc',
      myContract: 'contract',
      myLastRefresh: 'lastRefresh'
    })
  },

  watch: {
    myLastRefresh () {
      this.refreshCanvas()
    }
  },
  mounted () {
    let canvasElement = document.getElementById('place-canvasse')
    // let canvasElement = document.getElementById('zoom-canvas')
    this.$store.dispatch(Actions.SET_CANVASSE, new Canvasse(canvasElement))
    canvasElement.addEventListener('click', this.getPixelCoord)
    this.$store.dispatch(Actions.SET_LAST_REFRESH, Date.now())
  },

  methods: {

    async refreshCanvas () {
      if (this.$store.state.reloading) {
        console.log('Skipping reload')
        return
      }
      console.log('Reloading Canvas')
      this.$store.dispatch(Actions.SET_LOADING_STATUS, true)
      try {
        let canvas = await this.getPixelsRaw()
        this.$store.state.canvasse.setBufferFromRawArray(canvas)
      } finally {
        this.$store.dispatch(Actions.SET_LOADING_STATUS, false)
        // Zoom()
        this.createZoomCanvas()
        let canvasElement = document.getElementById('zoom-canvas')
        // this.$store.dispatch(Actions.SET_CANVASSE, new Canvasse(canvasElement))
        canvasElement.addEventListener('click', this.getZoomPixelCoord)
      }
    },

    getPixelCoord (event) {
      let currentTool = this.$store.state.activeTool
      if (currentTool === 'pencil' || currentTool === 'eraser') {
        let canvasElement = document.getElementById('place-canvasse')
        let rect = canvasElement.getBoundingClientRect()
        let pixelObj = {
          x: Math.floor(event.clientX - rect.left),
          y: Math.floor(event.clientY - rect.top)
        }
        currentTool === 'pencil' ? this.addPixelToPaintSession(pixelObj) : this.removePixelFromPaintSession(pixelObj)
      } else {
      }
    },

    getZoomPixelCoord (event) {
      debugger;
      let canvasElement = document.getElementById('zoom-canvas')
      let rect = canvasElement.getBoundingClientRect()
      let pixelObj = {
        x: Math.floor(event.clientX - rect.left),
        y: Math.floor(event.clientY - rect.top)
      }
      // this.addPixelToPaintSession(pixelObj)
      let ctx = canvasElement.getContext('2d')
      ctx.fillStyle = this.$store.state.activeColorName
      ctx.fillRect(pixelObj.x, pixelObj.y, 1, 1)
      console.log('x: ' + pixelObj.x + ' y: ' + pixelObj.y)
    },

    addPixelToPaintSession (pixelObj) {
      this.$store.dispatch(Actions.ADD_PIXEL_TO_ARRAY, pixelObj)

      // temporarily set color in canvas
      let canvasElement = document.getElementById('place-canvasse')
      let ctx = canvasElement.getContext('2d')
      ctx.fillStyle = this.$store.state.activeColorName
      ctx.fillRect(pixelObj.x, pixelObj.y, 1, 1)

      console.dir(this.$store.state.pixelCoordArray)
    },

    removePixelFromPaintSession (pixelObj) {
      this.$store.dispatch(Actions.REMOVE_PIXEL_FROM_ARRAY, pixelObj)
      console.dir(this.$store.state.pixelCoordArray)
    },

    async sendActions (actions) {
      try {
        this.$store.dispatch(Actions.SET_SENDING_TRANSACTION, true)
        return this.myApi.transact({
          actions: actions
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        })
      } catch (err) {
        console.log('\nCaught exception: ' + err)
        if (err instanceof RpcError) { console.log(JSON.stringify(err.json, null, 2)) }
      } finally {
        this.$store.dispatch(Actions.SET_SENDING_TRANSACTION, false)
      }
    },

    async setPixel (x, y, color) {
      let pixelId = (y * 1000) + x
      return this.sendActions([{
        account: this.contract,
        name: 'setpixel',
        authorization: [{
          actor: this.testuser,
          permission: 'active'
        }],
        data: {
          account: this.testuser,
          pixel: pixelId,
          color: color
        }
      }])
    },

    async getPixelsRaw () {
      var size = this.myWidth * this.myHeight
      var canvas = new Uint8Array(size)
      let lastRowLoaded = 0
      let rows = await this.getRows(lastRowLoaded)
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        for (let b = 0; b < row.data.length; b++) {
          let byte = row.data[b]
          let startPos = row.id * 1000
          let firstPos = startPos + (b * 2)
          let secondPos = startPos + (b * 2) + 1

          canvas[firstPos] = byte >> 4
          canvas[secondPos] = byte & 15
        }
      }
      return canvas
    },

    async getRows (fromIndex) {
      let response = {
        more: true
      }

      let rows = []

      while (response.more) {
        response = await this.myRpc.get_table_rows({
          json: true,
          table_key: 'id',
          scope: this.myContract,
          code: this.myContract,
          table: 'rows',
          lower_bound: isNaN(fromIndex) ? 0 : fromIndex,
          limit: this.myHeight
        })
        rows = rows.concat(response.rows)
      }

      return rows
    },
    createZoomCanvas() {
      var canvas = document.getElementById('zoom-canvas')
      canvas.width = 1000; canvas.height = 1000
      var ctx = canvas.getContext('2d')

      // disable browser "smoothing" on scaling as workaround for image-rendering
      ctx.mozImageSmoothingEnabled = false
      ctx.webkitImageSmoothingEnabled = false
      ctx.msImageSmoothingEnabled = false
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(document.getElementById('place-canvasse'), 0, 0)

      trackTransforms(ctx)
      function redraw () {
        // Clear the entire canvas
        var p1 = ctx.transformedPoint(0, 0)
        var p2 = ctx.transformedPoint(canvas.width, canvas.height)
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
        ctx.drawImage(document.getElementById('place-canvasse'), 0, 0)
      }
      redraw()

      let lastX = canvas.width / 2
      let lastY = canvas.height / 2
      let dragStart, dragged
      canvas.addEventListener('mousedown', function (evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none'
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft)
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop)
        dragStart = ctx.transformedPoint(lastX, lastY)
        dragged = false
      }, false)
      canvas.addEventListener('mousemove', function (evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft)
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop)
        dragged = true
        if (dragStart) {
          var pt = ctx.transformedPoint(lastX, lastY)
          ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y)
          redraw()
        }
      }, false)
      canvas.addEventListener('mouseup', function (evt) {
        dragStart = null
        if (!dragged) zoom(evt.shiftKey ? -1 : 1)
      }, false)

      var scaleFactor = 1.1
      var zoom = function (clicks) {
        var pt = ctx.transformedPoint(lastX, lastY)
        ctx.translate(pt.x, pt.y)
        var factor = Math.pow(scaleFactor, clicks)
        ctx.scale(factor, factor)
        ctx.translate(-pt.x, -pt.y)
        redraw()
      }

      var handleScroll = function (evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0
        if (delta) zoom(delta)
        return evt.preventDefault() && false
      }
      canvas.addEventListener('DOMMouseScroll', handleScroll, false)
      canvas.addEventListener('mousewheel', handleScroll, false)

      function trackTransforms (ctx) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        var xform = svg.createSVGMatrix()
        ctx.getTransform = function () { return xform }

        var savedTransforms = []
        var save = ctx.save
        ctx.save = function () {
          savedTransforms.push(xform.translate(0, 0))
          return save.call(ctx)
        }
        var restore = ctx.restore
        ctx.restore = function () {
          xform = savedTransforms.pop()
          return restore.call(ctx)
        }

        var scale = ctx.scale
        ctx.scale = function (sx, sy) {
          xform = xform.scaleNonUniform(sx, sy)
          return scale.call(ctx, sx, sy)
        }
        var rotate = ctx.rotate
        ctx.rotate = function (radians) {
          xform = xform.rotate(radians * 180 / Math.PI)
          return rotate.call(ctx, radians)
        }
        var translate = ctx.translate
        ctx.translate = function (dx, dy) {
          xform = xform.translate(dx, dy)
          return translate.call(ctx, dx, dy)
        }
        var transform = ctx.transform
        ctx.transform = function (a, b, c, d, e, f) {
          var m2 = svg.createSVGMatrix()
          m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f
          xform = xform.multiply(m2)
          return transform.call(ctx, a, b, c, d, e, f)
        }
        var setTransform = ctx.setTransform
        ctx.setTransform = function (a, b, c, d, e, f) {
          xform.a = a
          xform.b = b
          xform.c = c
          xform.d = d
          xform.e = e
          xform.f = f
          return setTransform.call(ctx, a, b, c, d, e, f)
        }
        var pt = svg.createSVGPoint()
        ctx.transformedPoint = function (x, y) {
          pt.x = x; pt.y = y
          return pt.matrixTransform(xform.inverse())
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
