import { Api, JsonRpc, RpcError } from 'eosjs'

import JsSignatureProvider from 'eosjs/dist/eosjs-jssig' // development only

const PlaceConfig = {
  width: 1000,
  height: 1000
}

class Place {
  constructor () {
    this.testuser = 'caleostester'
    this.privateKey = '5J6AMrtdbHhfDU4q2LFoDd4YThL7vmmvwaEaZxkpHqnpfbvE2dU'
    this.publicKey = 'EOS8ek6TD4kiwbVdSaCyVN5bbYiK1PusfFUdoq8VkmFJE27bbcqem'
    this.contract = 'caleoscanvas'
    this.endpoint = 'https://testnet.telos.caleos.io'
    this.rpc = new JsonRpc(this.endpoint)
    this.signatureProvider = new JsSignatureProvider([this.privateKey])
    this.api = new Api({ rpc: this.rpc, signatureProvider: this.signatureProvider })
    this.keyProvider = this.privateKey
  }

  async sendActions (actions) {
    try {
      return this.api.transact({
        actions: actions
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
    } catch (err) {
      console.log('\nCaught exception: ' + err)
      if (err instanceof RpcError) { console.log(JSON.stringify(err.json, null, 2)) }
    }
  }

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
  }

  async getPixelsRaw (callback) {
    this.rpc.get_table_rows({
      json: true,
      table_key: 'id',
      scope: this.contract,
      code: this.contract,
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
}

export default Place
