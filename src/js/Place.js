import Eos from 'eosjs'

const PlaceConfig = {
  width: 1000,
  height: 1000
  // defaultColor: 0,
  // zoomDimension: 200, //width of zoom window
  // zoomScale: 3, //magnification scale
  // scaleLevel: 200,
  // canvasSelector: "#place-canvasse",
  // parentDivSelector: "#place",
  // zoomWindowSelector: "#zoom-canvas",
  // xSelector: "#x-value",
  // ySelector: "#y-value",
  // colorSelector: "#color",
  // colorBoxSelector: "#color-box",
  // refreshButton: "#refresh-button",
  // paintButton: "#paint-button",
  // defaultColor: 0
}

class Place {
  constructor () {
    this.user1Private = '5KNfncH6Dc5jHf7rRnsc6uEFZKbrHQkoUTPzU9xSw1UpeCT9mJP'
    this.user1Public = 'EOS78PDo23NcGd6jkxR8oTXwWq1b7FHJcd9nq5Tcz9ftRAKd2JKyp'
    this.keyProvider = this.user1Private
    this.eos = Eos({httpEndpoint: 'http://poplexity.net:8888', keyProvider: this.keyProvider})
    this.options = {
      authorization: [
        'user1@active'
      ]
    }

    this.signProvider = (buf, sign) => {
      return sign(buf, this.user1Private)
    }
  }

  setPixel (x, y, color, callback) {
    this.eos.contract('place', {signProvider: this.signProvider}).then(place => {
      let pixelId = (y * 1000) + x
      place.setpixel('user1', pixelId, color, this.options).then(result => {
        callback(result)
      })
    })
  }

  getPixelsRaw (callback) {
    this.eos.getTableRows({
      json: true,
      table_key: 'id',
      scope: 'place',
      code: 'place',
      table: 'rows'
    }).then(function (result) {
      console.dir(result)
      var size = PlaceConfig.width * PlaceConfig.height
      var canvas = new Uint8Array(size)
      let rows = result.rows
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
      callback(canvas)
    })
  }

  placeTest () {
    return 'GLOBAL PLACE OBJECT!'
  }
}

export default Place
