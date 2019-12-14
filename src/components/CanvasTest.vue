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
import IrisClient from '@caleos/iris-client'
const colorList = [
  'white',
  'lightgrey',
  'grey',
  'black',
  'pink',
  'red',
  'orange',
  'brown',
  'yellow',
  'lime',
  'green',
  'cyan',
  'blue',
  'blue',
  'darkblue',
  'magenta',
  'purple'
]

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
      pixelCoordArray: 'pixelCoordArray'
    }),
    account() {
      if (!this.$store.state.scatter || !this.$store.state.scatter.identity)
        return null;
      return this.$store.state.scatter.identity.accounts[0];
    }
  },

  watch: {
    pixelCoordArray (pixelArray) {
      this.$root.$emit('update-canvas', pixelArray)
    }
  },
  mounted () {
    let canvasElement = document.getElementById('place-canvasse')
    this.$store.dispatch(Actions.SET_CANVASSE, new Canvasse(canvasElement))
    this.$store.dispatch(Actions.SET_LAST_REFRESH, Date.now())
    this.setupCanvasWatcher()
    this.refreshCanvas()
  },

  methods: {
    async setupCanvasWatcher () {
      this.iris = new IrisClient(`ws://${process.env.VUE_APP_IRIS}/iris-head`)
      await this.iris.connect()
      this.iris.subscribeAction(
        `${process.env.VUE_APP_CONTRACT}::setpixels`,
        message => {
          let data = message.trace.act.data
          console.dir(message)
          for (let i = 0; i < data.pixels.length; i++) {
            let pixel = data.pixels[i]
            let color = colorList[data.colors[i]]
            let x = pixel % 1000
            let y = (pixel - x) / 1000
            let pixelObj = { x, y }
            this.paintTempPixels(pixelObj, color)
          }
        }
      )
    },

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
        // this.mZoom()
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
          let firstPos = startPos + b * 2
          let secondPos = startPos + b * 2 + 1
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

    paintTempPixels (pixelObj, color) {
      let zoomCanvas = document.getElementById('place-canvasse')
      let ctxZoom = zoomCanvas.getContext('2d')
      ctxZoom.fillStyle = color
      // console.log('pixelObj',pixelObj)
      ctxZoom.fillRect(pixelObj.x, pixelObj.y, 1, 1)
    },

    createZoomCanvas () {
      let state = this.$store.state
      // let canvass = document.getElementById('place-canvasse')
      // let ctxs = canvass.getContext('2d')

      requestAnimationFrame(draw)

      /// OLD
      let setTransactionButton = () => {
        let cooldownExpires = this.$store.state.contractAccount
          ? moment.unix(
            this.$store.state.contractAccount.last_access +
                this.$store.state.config.cooldown
          )
          : moment.unix()
        if (cooldownExpires.isBefore()) {
          if (this.$store.state.pixelCoordArray.length) {
            this.$root.$emit('cooldown', false)
          } else {
            this.$root.$emit('cooldown')
          }
        }
      }

      let paintZoom = event => {
        console.log('paintZoom')
        if (!this.account) {
          return
        }
        if (this.$store.state.pixelsRemaining < 1) {
          alert(
            'You have painted the maximum number of pixels, click the green arrow button below to set the pixels and begin a new session.'
          )
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
        // var mousex = event.clientX - canvas.offsetLeft
        // var mousey = event.clientY - canvas.offsetTop

        // let pixelObj = {
        //   x: Math.floor(mousex),
        //   y: Math.floor(mousey)
        // }
        // temporarily display selected pixel on zoom canvas, it's redrawn on transform
        // let scale = canvasElement.width / 1000.0
        var scale = view.getScale()
        // var scale = 1
        // console.log('scale',scale)
        // let scale = canvasElement.width / 1000.0
        let indexOffset = -1
        let scaledX = Math.floor(pixelObj.x / scale) * scale
        let scaledY = Math.floor(pixelObj.y / scale) * scale
        let ctxZoom = canvasElement.getContext('2d')
        ctxZoom.fillStyle = this.$store.state.activeColorName
        ctxZoom.fillRect(scaledX, scaledY, scale, scale)
        // pixelObj.x = Math.ceil(pixelObj.x / scale) + indexOffset
        // pixelObj.y = Math.ceil(pixelObj.y / scale) + indexOffset
        pixelObj.x = Math.ceil(mouse.worldPos.x) + indexOffset
        pixelObj.y = Math.ceil(mouse.worldPos.y) + indexOffset
        this.$store.dispatch(Actions.ADD_PIXEL_TO_ARRAY, pixelObj)
        setTransactionButton()
        this.paintTempPixels(pixelObj, state.activeColorName)
      }

      let mouseUpFunction = evt => {
        // dragStart = null
        // canvas.className = ''
        // console.log('dragging', mouse.dragging)
        if (!mouse.dragging) paintZoom(evt)
        mouse.dragging = false
      }

      var zoomIntensity = 0.2

      var canvas = document.getElementById('zoom-canvas')
      var canvas2 = document.getElementById('place-canvasse')
      var context = canvas.getContext('2d')
      // var context2 = canvas2.getContext('2d')
      var width = 200
      var height = 200
      context.font = '24px arial'
      context.textAlign = 'center'
      context.lineJoin = 'round' // to prevent miter spurs on strokeText
      // fill smaller canvas with random pixels
      // for(var x = 0; x < 100; x++){
      //   for(var y = 0; y < 100; y++) {
      //     var rando = function(){return Math.floor(Math.random() * 9)};
      //     var val = rando();
      //     if(x === 0 || y === 0 || x === 99 || y === 99){
      //         //context2.fillStyle = "#FF0000";
      //     }else{
      //         //context2.fillStyle = "#" + val + val + val;

      //     }
      //     //context2.fillRect(x,y,1,1);
      //   }
      // }

      // mouse holds mouse position button state, and if mouse over canvas with overid
      var mouse = {
        pos: { x: 0, y: 0 },
        worldPos: { x: 0, y: 0 },
        posLast: { x: 0, y: 0 },
        button: false,
        overId: '', // id of element mouse is over
        dragging: false,
        whichWheel: -1, // first wheel event will get the wheel
        wheel: 0
      }

      // View handles zoom and pan (can also handle rotate but have taken that out as rotate can not be contrained without losing some of the image or seeing some of the background.
      const view = (() => {
        const matrix = [1, 0, 0, 1, 0, 0] // current view transform
        const invMatrix = [1, 0, 0, 1, 0, 0] // current inverse view transform
        var m = matrix // alias
        var im = invMatrix // alias
        var scale = 1 // current scale
        const bounds = {
          topLeft: 0,
          left: 0,
          right: 200,
          bottom: 200
        }
        var useConstraint = true // if true then limit pan and zoom to
        // keep bounds within the current context

        var maxScale = 1
        const workPoint1 = { x: 0, y: 0 }
        const workPoint2 = { x: 0, y: 0 }
        const wp1 = workPoint1 // alias
        const wp2 = workPoint2 // alias
        var ctx
        const pos = {
          // current position of origin
          x: 0,
          y: 0
        }
        var dirty = true
        const API = {
          canvasDefault () {
            ctx.setTransform(1, 0, 0, 1, 0, 0)
          },
          apply () {
            if (dirty) {
              this.update()
            }
            ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
          },
          getScale () {
            return scale
          },
          getMaxScale () {
            return maxScale
          },
          getMaxZoom () {
            return 46
          },
          matrix, // expose the matrix
          invMatrix, // expose the inverse matrix
          update () {
            // call to update transforms
            dirty = false
            m[3] = m[0] = scale
            m[1] = m[2] = 0
            m[4] = pos.x
            m[5] = pos.y
            if (useConstraint) {
              this.constrain()
            }
            this.invScale = 1 / scale
            // calculate the inverse transformation
            var cross = m[0] * m[3] - m[1] * m[2]
            im[0] = m[3] / cross
            im[1] = -m[1] / cross
            im[2] = -m[2] / cross
            im[3] = m[0] / cross
          },
          constrain () {
            maxScale = Math.min(
              ctx.canvas.width / (bounds.right - bounds.left),
              ctx.canvas.height / (bounds.bottom - bounds.top)
            )
            if (scale < maxScale) {
              m[0] = m[3] = scale = maxScale
            }
            wp1.x = bounds.left
            wp1.y = bounds.top
            this.toScreen(wp1, wp2)
            if (wp2.x > 0) {
              m[4] = pos.x -= wp2.x
            }
            if (wp2.y > 0) {
              m[5] = pos.y -= wp2.y
            }
            wp1.x = bounds.right
            wp1.y = bounds.bottom
            this.toScreen(wp1, wp2)
            if (wp2.x < ctx.canvas.width) {
              m[4] = pos.x -= wp2.x - ctx.canvas.width
            }
            if (wp2.y < ctx.canvas.height) {
              m[5] = pos.y -= wp2.y - ctx.canvas.height
            }
          },
          toWorld (from, point = {}) {
            // convert screen to world coords
            var xx, yy
            if (dirty) {
              this.update()
            }
            xx = from.x - m[4]
            yy = from.y - m[5]
            point.x = xx * im[0] + yy * im[2]
            point.y = xx * im[1] + yy * im[3]
            return point
          },
          toScreen (from, point = {}) {
            // convert world coords to screen coords
            if (dirty) {
              this.update()
            }
            point.x = from.x * m[0] + from.y * m[2] + m[4]
            point.y = from.x * m[1] + from.y * m[3] + m[5]
            return point
          },
          scaleAt (at, amount) {
            // at in screen coords
            if (dirty) {
              this.update()
            }
            scale *= amount
            pos.x = at.x - (at.x - pos.x) * amount
            pos.y = at.y - (at.y - pos.y) * amount
            dirty = true
          },
          move (x, y) {
            // move is in screen coords
            pos.x += x
            pos.y += y
            dirty = true
          },
          setContext (context) {
            ctx = context
            dirty = true
          },
          setBounds (top, left, right, bottom) {
            bounds.top = top
            bounds.left = left
            bounds.right = right
            bounds.bottom = bottom
            useConstraint = true
            dirty = true
          }
        }
        return API
      })()
      view.setBounds(0, 0, canvas2.width, canvas2.height)
      view.setContext(context)

      // draw the larger canvas
      function draw () {
        view.canvasDefault() // se default transform to clear screen
        context.imageSmoothingEnabled = false
        context.fillStyle = 'white'
        context.fillRect(0, 0, width, height)
        view.apply() // set the current view
        context.drawImage(canvas2, 0, 0)
        view.canvasDefault()
        /*
        if (view.getScale() === view.getMaxScale()) {
          context.fillStyle = 'black'
          context.strokeStyle = 'white'
          context.lineWidth = 2.5
          context.strokeText('Max scale.', context.canvas.width / 2, 24)
          context.fillText('Max scale.', context.canvas.width / 2, 24)
        }
        */
        requestAnimationFrame(draw)
        if (mouse.overId === 'zoom-canv_as') {
          canvas.style.cursor = mouse.button ? 'none' : 'move'
        } else {
          canvas.style.cursor = 'default'
        }
      }
      // add events to document so that mouse is captured when down on canvas
      // This allows the mouseup event to be heard no matter where the mouse has
      // moved to.
      'mousemove,mousedown,mouseup,mousewheel,wheel,DOMMouseScroll'
        .split(',')
        .forEach(eventName => document.addEventListener(eventName, mouseEvent))

      function mouseEvent (event) {
        mouse.overId = event.target.id
        if (event.target.id === 'zoom-canvas' || mouse.dragging) {
          // only interested in canvas mouse events including drag event started on the canvas.

          mouse.posLast.x = mouse.pos.x
          mouse.posLast.y = mouse.pos.y
          mouse.pos.x = event.clientX - canvas.offsetLeft
          mouse.pos.y = event.clientY - canvas.offsetTop
          view.toWorld(mouse.pos, mouse.worldPos) // gets the world coords (where on canvas 2 the mouse is)
          if (event.type === 'mousemove') {
            if (mouse.button) {
              mouse.dragging = true
              view.move(
                mouse.pos.x - mouse.posLast.x,
                mouse.pos.y - mouse.posLast.y
              )
            }
          } else if (event.type === 'mousedown') {
            mouse.button = true
            mouse.dragging = false
          } else if (event.type === 'mouseup') {
            mouse.button = false
            mouseUpFunction(event)
          } else if (
            event.type === 'mousewheel' &&
            (mouse.whichWheel === 1 || mouse.whichWheel === -1)
          ) {
            mouse.whichWheel = 1
            mouse.wheel = event.wheelDelta
          } else if (
            event.type === 'wheel' &&
            (mouse.whichWheel === 2 || mouse.whichWheel === -1)
          ) {
            mouse.whichWheel = 2
            mouse.wheel = -event.deltaY
          } else if (
            event.type === 'DOMMouseScroll' &&
            (mouse.whichWheel === 3 || mouse.whichWheel === -1)
          ) {
            mouse.whichWheel = 3
            mouse.wheel = -event.detail
          }
          if (mouse.wheel !== 0) {
            event.preventDefault()
            if (view.getScale() < view.getMaxZoom() || mouse.wheel < 0) {
              view.scaleAt(
                mouse.pos,
                Math.exp((mouse.wheel / 120) * zoomIntensity)
              )
            }
            mouse.wheel = 0
          }
        }
      }

      this.$root.$on('undo-last', async () => {
        await this.getPixelsRaw().then(pixelArray => {
          this.$store.state.intColorArray.pop()
          let lastPixelCoord = this.$store.state.pixelCoordArray.pop()
          let lastPixelObj = this.$store.state.pixelObjArray.pop()
          let colorInt = pixelArray[lastPixelCoord]
          let colorName = this.$store.state.canvasse.palleteNames[colorInt]
          this.paintTempPixels(lastPixelObj, colorName)
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
