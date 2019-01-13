<template>
  <div
    id="place"
    class="place"
  >
    <canvas
      id="place-canvasse"
      class="place-canvas"
    />
    <canvas
      id="zoom-canvas"
      width="1000"
      height="1000"
    />
  </div>
</template>

<script>

import Canvasse from '../js/Canvasse'
import { Actions } from '../actions'
import { mapState } from 'vuex'
import moment from 'moment'

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
      myContract: 'contract'
    })
  },

  watch: {
  },
  mounted () {
    let canvasElement = document.getElementById('place-canvasse')
    this.$store.dispatch(Actions.SET_CANVASSE, new Canvasse(canvasElement))
    this.$store.dispatch(Actions.SET_LAST_REFRESH, Date.now())
    this.refreshCanvas()
  },

  methods: {
    async refreshCanvas () {
      if (this.$store.state.reloading) {
        return
      }
      this.$store.dispatch(Actions.SET_LOADING_STATUS, true)
      try {
        let canvas = await this.getPixelsRaw()
        this.$store.state.canvasse.setBufferFromRawArray(canvas)
      } finally {
        this.$store.dispatch(Actions.SET_LOADING_STATUS, false)
        this.createZoomCanvas()
      }
    },
    removePixelFromPaintSession (pixelObj) {
      this.$store.dispatch(Actions.REMOVE_PIXEL_FROM_ARRAY, pixelObj)
      console.dir(this.$store.state.pixelCoordArray)
      if (this.$store.state.pixelCoordArray.length === 0) {
        this.$root.$emit('cooldown')
      }
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

    createZoomCanvas () {
      let state = this.$store.state
      let canvas = document.getElementById('zoom-canvas')
      let ctx = canvas.getContext('2d')
      let initialZoom = Math.log(screen.width / 1000) / Math.log(1.1)
      let scaleFactor = 1.1
      let maxCanvasWidth = 9000
      let minCanvasWidth = 1100
      let lastX = canvas.width / 2
      let lastY = canvas.height / 2
      let dragStart, dragged
      ctx.mozImageSmoothingEnabled = false
      ctx.webkitImageSmoothingEnabled = false
      ctx.msImageSmoothingEnabled = false
      ctx.imageSmoothingEnabled = false
      // ctx.drawImage(document.getElementById('place-canvasse'), 0, 0)  //draw unzoomed
      // canvas.style.left = (parseInt(screen.width) / 2) - 500 + 'px' //to center unzoomed canvas
      var zoom = function (clicks) {
        if ((canvas.width >= maxCanvasWidth && clicks > 0) || (canvas.width <= minCanvasWidth && clicks < 0)) return
        var factor = scaleFactor ** clicks
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.scale(ctx, factor, factor)
        canvas.width *= factor
        canvas.height *= factor
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(document.getElementById('place-canvasse'), 0, 0, canvas.width, canvas.height)
      }

      let setTransactionButton = () => {
        let cooldownExpires = this.$store.state.contractAccount ? moment.unix(this.$store.state.contractAccount.last_access + this.$store.state.config.cooldown) : moment.unix()
        if (cooldownExpires.isBefore()) {
          if (this.$store.state.pixelCoordArray.length) {
            this.$root.$emit('cooldown', false)
          } else {
            this.$root.$emit('cooldown')
          }
        }
      }

      let paintTempPixels = (pixelObj, color) => {
        let zoomCanvas = document.getElementById('place-canvasse')
        let ctxZoom = zoomCanvas.getContext('2d')
        ctxZoom.fillStyle = color
        ctxZoom.fillRect(pixelObj.x, pixelObj.y, 1, 1)
      }

      let paintZoom = (event) => {
        if (this.$store.state.pixelCoordArray.length === this.$store.state.config.pixels_per_paint) {
          alert('You have painted the maximum amount of pixels, click the green arrow button below to set the pixels and begin a new session.')
          return
        }
        if (this.$store.state.activeColorInt === null) {
          this.$store.dispatch(Actions.SET_ACTIVE_COLOR_NAME, 'black')
          this.$store.dispatch(Actions.SET_ACTIVE_COLOR_HEX, '#000000')
          this.$store.dispatch(Actions.SET_ACTIVE_COLOR_INT, '3')
        }
        let canvasElement = document.getElementById('zoom-canvas')
        let rect = canvasElement.getBoundingClientRect()
        let pixelObj = {
          x: Math.floor(event.clientX - rect.left),
          y: Math.floor(event.clientY - rect.top)
        }
        // temporarily display selected pixel on zoom canvas, it's redrawn on transform
        let scale = canvasElement.width / 1000.0
        let indexOffset = -1
        let scaledX = Math.floor(pixelObj.x / scale) * scale
        let scaledY = Math.floor(pixelObj.y / scale) * scale
        let ctxZoom = canvasElement.getContext('2d')
        ctxZoom.fillStyle = this.$store.state.activeColorName
        ctxZoom.fillRect(scaledX, scaledY, scale, scale)
        pixelObj.x = Math.ceil(pixelObj.x / scale) + indexOffset
        pixelObj.y = Math.ceil(pixelObj.y / scale) + indexOffset
        this.$store.dispatch(Actions.ADD_PIXEL_TO_ARRAY, pixelObj)
        setTransactionButton()
        paintTempPixels(pixelObj, state.activeColorName)
      }

      let mouseDownfunction = (evt) => {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none'
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft)
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop)
        dragStart = { x: lastX, y: lastY }
        dragged = false
      }

      let mouseMoveFunction = (evt) => {
        if (!dragStart) return
        canvas.className = ' grabbable'
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft)
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop)
        dragged = true
        let moveX = lastX - dragStart.x
        let moveY = lastY - dragStart.y
        let top = window.getComputedStyle(canvas).getPropertyValue('top')
        let left = window.getComputedStyle(canvas).getPropertyValue('left')
        canvas.style.left = parseInt(left, 10) + moveX + 'px'
        canvas.style.top = parseInt(top, 10) + moveY + 'px'
      }

      let mouseUpFunction = (evt) => {
        dragStart = null
        canvas.className = ''
        if (!dragged) paintZoom(evt)
      }

      var handleScroll = function (evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 120 : evt.detail ? -evt.detail : 0
        if (delta) zoom(delta)
        return evt.preventDefault() && false
      }

      this.$root.$on('zoom-out', () => {
        zoom(-1)
      })
      this.$root.$on('zoom-in', () => {
        zoom(1)
      })

      canvas.removeEventListener('mousedown', mouseDownfunction)
      canvas.addEventListener('mousedown', mouseDownfunction, false)
      canvas.removeEventListener('mousemove', mouseMoveFunction)
      canvas.addEventListener('mousemove', mouseMoveFunction, false)
      canvas.removeEventListener('mouseup', mouseUpFunction)
      canvas.addEventListener('mouseup', mouseUpFunction, false)
      canvas.addEventListener('DOMMouseScroll', handleScroll, false)
      canvas.addEventListener('mousewheel', handleScroll, false)

      zoom(initialZoom)
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
