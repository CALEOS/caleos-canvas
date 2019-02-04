
const { AbstractActionHandler } = require('demux')

const WebSocket = require('ws')
const server = new WebSocket.Server({port: 8081})
const fs = require('fs')
const stateJson = './state.json'
const MAX_PAINT_HISTORY = 10000
const MAX_CHAT_HISTORY = 10000

// Initial state
let state = {
  websocketServer: server,
  paintHistory: [],
  chatHistory: [],
  indexState: {
    blockNumber: 0,
    blockHash: '',
    isReplay: false,
    handlerVersionName: 'v1'
  }
}

if (fs.existsSync(stateJson)) {
  let oldState = fs.readFileSync(stateJson)
  state = JSON.parse(oldState)
  supplementState(state)
}

function supplementState (state) {
  state.websocketServer = server
  pushPrototype(state.paintHistory, MAX_PAINT_HISTORY)
  pushPrototype(state.chatHistory, MAX_CHAT_HISTORY)
}

function pushPrototype (arrayInstance, max) {
  arrayInstance.push = function () {
    Array.prototype.push.apply(this, arguments)

    if (this.length < max) {
      return
    }

    Array.prototype.splice.call(this, max, (this.length - max))
  }
}

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

function sendPing () {
  server.broadcast(JSON.stringify({'action': 'ping'}))
}

function saveState () {
  fs.writeFile(stateJson, JSON.stringify(state, (k, v) => {
    return k === 'websocketServer' ? undefined : v
  }), function (err) {
    if (err) {
      return console.log(err)
    }

    console.log('Saved state')
  })
}

// send ping every 30 seconds for nginx
setInterval(sendPing, 30000)

// write state every 10 seconds
setInterval(saveState, 10000)

function handleIncoming (webSocket, data) {
  let message = JSON.parse(data)
  if (message && message.action && message.action === 'chat') {
    server.broadcast(JSON.stringify(message))
    state.chatHistory.push(message)
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

  getStartAtBlock () {
    return state.indexState.blockNumber
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
    supplementState(state)
  }
}

module.exports = CanvasActionHandler
