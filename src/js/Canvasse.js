class Canvasse {
  constructor (el) {
    let width = 1000
    let height = 1000
    this.palleteHex = [
      '#FFFFFF', // white
      '#D3D3D3', // light grey
      '#808080', // grey
      '#000000', // black
      '#FFC0CB', // pink
      '#FF0000', // red
      '#FFA500', // orange
      '#A52A2A', // brown
      '#FFFF00', // yellow
      '#00FF00', // lime
      '#008000', // green
      '#00FFFF', // cyan
      '#0000FF', // blue
      '#00008B', // dark blue
      '#FF00FF', // magenta
      '#820080' // purple
    ]

    this.palleteNames = [
      'white',
      'light grey',
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
      'dark blue',
      'magenta',
      'purple'
    ]

    this.palleteAGBR = this.getPalleteAGBR(this.palleteHex)
    this.width = width
    this.height = height
    this.isBufferDirty = false
    this.isDisplayDirty = false

    // The canvas state as visible to the user
    this.el = el
    this.el.width = 1000
    this.el.height = 1000
    this.ctx = this.el.getContext('2d')
    this.ctx.mozImageSmoothingEnabled = false
    this.ctx.webkitImageSmoothingEnabled = false
    this.ctx.msImageSmoothingEnabled = false
    this.ctx.imageSmoothingEnabled = false

    // This array buffer will hold color data to be drawn to the canvas.
    this.buffer = new ArrayBuffer(width * height * 4)
    // This view into the buffer is used to construct the PixelData object
    // for drawing to the canvas
    this.readBuffer = new Uint8ClampedArray(this.buffer)
    // This view into the buffer is used to write.  Values written should be
    // 32 bit colors stored as AGBR (rgba in reverse).
    this.writeBuffer = new Uint32Array(this.buffer)
  }

  /**
     * Tick function that draws buffered updates to the display.
     * @function
     * @returns {boolean} Returns true if any updates were made
     */
  tick () {
    if (this.isBufferDirty) {
      this.drawBufferToDisplay()
      return true
    }
    return false
  }

  /**
     * Draw a color to the buffer canvas and immediately update.
     * Coordinates are in canvas pixels, not screen pixels.
     * @deprecated Use drawTileToDisplay or drawTileToBuffer
     * @function
     * @param {int} x
     * @param {int} y
     * @param {number} color AGBR color number
     */
  // drawTileAt (x, y, color) {
  //   this.drawTileToBuffer(x, y, color)
  //   var api = require('./api')
  //   api.draw(x, y, color)
  // }

  /**
     * Draw a color to the display canvas
     * Used for optimistic updates or temporary drawing for UI purposes.
     * Updates will be lost if drawBufferToDisplay is called.
     * @function
     * @param {int} x
     * @param {int} y
     * @param {string} color Any valid css color string
     */
  drawTileToDisplay (x, y, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, 1, 1)
    this.isDisplayDirty = true
  }

  /**
     * Fill a rectangle on the display canvas with the given color.
     * @function
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @param {string} color Any valid css color string
     */
  drawRectToDisplay (x, y, width, height, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, width, height)
    this.isDisplayDirty = true
  }

  /**
     * Fill a rectangle on the display canvas with the given color.
     * @function
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     */
  clearRectFromDisplay (x, y, width, height) {
    this.ctx.clearRect(x, y, width, height)
    this.isDisplayDirty = true
  }

  /**
     * Draw a color to the buffer canvas
     * Does not update the display canvas. Call drawBufferToDisplay to copy
     * buffered updates to the display.
     * @function
     * @param {int} x
     * @param {int} y
     * @param {number} color AGBR color
     */
  drawTileToBuffer (x, y, color) {
    var i = this.getIndexFromCoords(x, y)
    this.setBufferState(i, color)
  }

  /**
     * Get the flat-array index of the tile at the given coordinates
     * @function
     * @param {int} x
     * @param {int} y
     * @returns {int}
     */
  getIndexFromCoords (x, y) {
    return y * this.width + x
  }

  /**
     * Draw a color to the buffer canvas
     * Does not update the display canvas. Call drawBufferToDisplay to copy
     * buffered updates to the display.
     * @function
     * @param {int} i
     * @param {number} color AGBR color
     */
  setBufferState (i, color) {
    this.writeBuffer[i] = color
    this.isBufferDirty = true
  }

  setBufferFromRawArray (arr) {
    for (let i = 0; i < arr.length; i++) {
      this.setBufferState(i, this.palleteAGBR[arr[i]])
    }
    this.drawBufferToDisplay()
  }

  getPalleteAGBR (palletHexArray) {
    var dataView = new DataView(new ArrayBuffer(4))
    // The first byte is alpha, which is always going to be 0xFF
    dataView.setUint8(0, 0xFF)
    return palletHexArray.map(function (colorString) {
      var color = Canvasse.parseHexColor(colorString)
      dataView.setUint8(1, color.blue)
      dataView.setUint8(2, color.green)
      dataView.setUint8(3, color.red)
      return dataView.getUint32(0)
    })
  }

  static parseHexColor (hexColor) {
    var colorVal = parseInt(hexColor.slice(1), 16)
    return {
      red: colorVal >> 16 & 0xFF,
      green: colorVal >> 8 & 0xFF,
      blue: colorVal & 0xFF
    }
  }

  /**
     * Update the display canvas by drawing from the buffered canvas
     * @function
     */
  drawBufferToDisplay () {
    var imageData = new ImageData(this.readBuffer, this.width, this.height)
    this.ctx.putImageData(imageData, 0, 0)
    this.isBufferDirty = false
  }
}

export default Canvasse
