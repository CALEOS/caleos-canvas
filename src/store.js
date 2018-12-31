import Vue from 'vue'
import Vuex from 'vuex'
import {Actions} from './actions'
import {Network} from 'scatterjs-core'
import {JsonRpc} from 'eosjs'

Vue.use(Vuex)

const network = Network.fromJson({
  blockchain: 'eos',
  protocol: 'https',
  host: 'testnet.telos.caleos.io',
  port: 443,
  chainId: 'e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3'
})

const state = {
  width: 1000,
  height: 1000,
  contract: 'caleoscanvas',
  scatterAppName: 'caleoscanvas',
  canvasse: null,
  scatter: null,
  identity: null,
  count: 0,
  network: network,
  rpc: new JsonRpc(network.fullhost(), {fetch}),
  api: null,
  lastRefresh: null,
  activeTool: null,
  activeColorInt: null,
  activeColorName: null,
  activeColorHex: null,
  reloading: false,
  pixelCoordArray: [],
  colorArray: []
}

const actions = {
  [Actions.SET_IDENTITY] ({ commit }, identity) {
    commit(Actions.SET_IDENTITY, identity)
  },
  [Actions.SET_API] ({ commit }, api) {
    commit(Actions.SET_API, api)
  },
  [Actions.SET_LAST_REFRESH] ({ commit }, lastRefresh) {
    commit(Actions.SET_LAST_REFRESH, lastRefresh)
  },
  [Actions.SET_CANVASSE] ({ commit }, canvasse) {
    commit(Actions.SET_CANVASSE, canvasse)
  },
  [Actions.SET_SCATTER] ({ commit }, scatter) {
    if (scatter.identity) { commit(Actions.SET_IDENTITY, scatter.identity) }
    commit(Actions.SET_SCATTER, scatter)
  },
  [Actions.INCREMENT] ({ commit }) {
    commit(Actions.INCREMENT)
  },
  [Actions.SET_ACTIVE_TOOL] ({ commit }, toolName) {
    commit(Actions.SET_ACTIVE_TOOL, toolName)
  },
  [Actions.SET_ACTIVE_COLOR_INT] ({ commit }, colorInt) {
    commit(Actions.SET_ACTIVE_COLOR_INT, colorInt)
  },
  [Actions.SET_ACTIVE_COLOR_NAME] ({ commit }, colorName) {
    commit(Actions.SET_ACTIVE_COLOR_NAME, colorName)
  },
  [Actions.SET_ACTIVE_COLOR_HEX] ({ commit }, colorHex) {
    commit(Actions.SET_ACTIVE_COLOR_HEX, colorHex)
  },
  [Actions.SET_LOADING_STATUS] ({ commit }, boolStatus) {
    commit(Actions.SET_LOADING_STATUS, boolStatus)
  },
  [Actions.ADD_PIXEL_TO_ARRAY] ({ commit }, pixelObj) {
    commit(Actions.ADD_PIXEL_TO_ARRAY, pixelObj)
  },
  [Actions.CLEAR_PIXEL_ARRAY] ({ commit }) {
    commit(Actions.CLEAR_PIXEL_ARRAY)
  }
}

const mutations = {
  [Actions.SET_IDENTITY] (state, identity) {
    state.identity = identity
  },
  [Actions.SET_API] (state, api) {
    state.api = api
  },
  [Actions.SET_LAST_REFRESH] (state, lastRefresh) {
    state.lastRefresh = lastRefresh
  },
  [Actions.SET_CANVASSE] (state, canvasse) {
    state.canvasse = canvasse
  },
  [Actions.SET_SCATTER] (state, scatter) {
    state.scatter = scatter
  },
  [Actions.INCREMENT] (state) {
    state.count++
  },
  [Actions.SET_ACTIVE_TOOL] (state, toolName) {
    state.activeTool = toolName
  },
  [Actions.SET_ACTIVE_COLOR_INT] (state, int) {
    state.activeColorInt = int
  },
  [Actions.SET_ACTIVE_COLOR_NAME] (state, colorName) {
    state.activeColorName = colorName
  },
  [Actions.SET_ACTIVE_COLOR_HEX] (state, colorHex) {
    state.activeColorHex = colorHex
  },
  [Actions.SET_LOADING_STATUS] (state, boolStatus) {
    state.reloading = boolStatus
  },
  [Actions.ADD_PIXEL_TO_ARRAY] (state, pixelObj) {
    state.pixelCoordArray.push((pixelObj.y * 1000) + pixelObj.x)
    state.colorArray.push(state.activeColorInt)
    console.dir(state.pixelCoordArray)
  },
  [Actions.CLEAR_PIXEL_ARRAY] (state) {
    state.pixelCoordArray = []
    state.colorArray = []
    console.dir(state.pixelCoordArray)
  }
}

export const store = new Vuex.Store({
  state,
  actions,
  mutations
})
