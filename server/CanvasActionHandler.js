
const { AbstractActionHandler } = require('demux')

const WebSocket = require('ws')
const server = new WebSocket.Server({port: 8081})

// Broadcast to all.
server.broadcast = function broadcast (data) {
  console.log('broadcasing: ' + data)
  server.clients.forEach(function each (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

server.on('connection', function connection (ws) {
  ws.on('message', (function (ws) {
    return function (data) {
      handleIncoming(ws, data)
    }
  })(ws))
  // ws.send(getStateMessage())
})

function handleIncoming (webSocket, data) {
  console.log('Unknown incoming websocket message: ' + JSON.stringify((data)))
}

// Initial state
let state = {
  websocketServer: server,
  indexState: {
    blockNumber: 0,
    blockHash: '',
    isReplay: false,
    handlerVersionName: 'v1'
  }
}

const stateHistory = {}
const stateHistoryMaxLength = 300

class CanvasActionHandler extends AbstractActionHandler {
  async handleWithState (handle) {
    await handle(state)
    const { blockNumber } = state.indexState
    stateHistory[blockNumber] = JSON.parse(JSON.stringify(state))
    if (blockNumber > stateHistoryMaxLength && stateHistory[blockNumber - stateHistoryMaxLength]) {
      delete stateHistory[blockNumber - stateHistoryMaxLength]
    }
  }

  async loadIndexState () {
    return state.indexState
  }

  async updateIndexState (stateObj, block, isReplay, handlerVersionName) {
    stateObj.indexState.blockNumber = block.blockInfo.blockNumber
    stateObj.indexState.blockHash = block.blockInfo.blockHash
    stateObj.indexState.isReplay = isReplay
    stateObj.indexState.handlerVersionName = handlerVersionName
  }

  async rollbackTo (blockNumber) {
    const latestBlockNumber = state.indexState.blockNumber
    const toDelete = [...Array(latestBlockNumber - (blockNumber)).keys()].map(n => n + blockNumber + 1)
    for (const n of toDelete) {
      delete stateHistory[n]
    }
    state = stateHistory[blockNumber]
  }
}

module.exports = CanvasActionHandler
