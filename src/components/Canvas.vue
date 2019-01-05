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
import Zoom from '../js/zoom'

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
        Zoom()
        let canvasElement = document.getElementById('zoom-canvas')
        // this.$store.dispatch(Actions.SET_CANVASSE, new Canvasse(canvasElement))
        canvasElement.addEventListener('click', this.getZoomPixelCoord)
      }
    },

    getPixelCoord (event) {
      let currentTool = this.$store.state.activeTool
      if (currentTool === 'pencil') {
        if (this.$store.state.activeColorInt === null) {
          this.$store.dispatch(Actions.SET_ACTIVE_COLOR_NAME, 'black')
          this.$store.dispatch(Actions.SET_ACTIVE_COLOR_HEX, '#222222')
          this.$store.dispatch(Actions.SET_ACTIVE_COLOR_INT, '3')
        }
        let canvasElement = document.getElementById('place-canvasse')
        let rect = canvasElement.getBoundingClientRect()
        let pixelObj = {
          x: Math.floor(event.clientX - rect.left),
          y: Math.floor(event.clientY - rect.top)
        }
        this.addPixelToPaintSession(pixelObj)
        console.log('x: ' + pixelObj.x + ' y: ' + pixelObj.y)
      } else if (currentTool === 'eraser') {
        console.log('erasing pixel')
      } else {

      }
    },

    getZoomPixelCoord (event) {
      let canvasElement = document.getElementById('zoom-canvas')
      let rect = canvasElement.getBoundingClientRect()
      let pixelObj = {
        x: event.clientX - rect.left,
        y: Math.floor(event.clientY - rect.top)
      }
      // this.addPixelToPaintSession(pixelObj)
      console.log('x: ' + pixelObj.x + ' y: ' + pixelObj.y)
    },

    addPixelToPaintSession (pixelObj) {
      this.$store.dispatch(Actions.ADD_PIXEL_TO_ARRAY, pixelObj)
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
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
