import Vue from 'vue'
import Vuex from 'vuex'
import {Actions} from './actions'

Vue.use(Vuex)

const state = {
  count: 0,
  activeTool: null,
  activeColorName: null,
  activeColorHex: null,
  reloading: false,
  pixelCoordArray: []
}

const actions = {
  [Actions.INCREMENT] ({ commit }) {
    commit(Actions.INCREMENT)
  },
  [Actions.SET_ACTIVE_TOOL] ({ commit }, toolName) {
    commit(Actions.SET_ACTIVE_TOOL, toolName)
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
  [Actions.INCREMENT] (state) {
    state.count++
  },
  [Actions.SET_ACTIVE_TOOL] (state, toolName) {
    state.activeTool = toolName
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
    state.pixelCoordArray.push({x: pixelObj.x, y: pixelObj.y, color: state.activeColorHex})
    console.dir(state.pixelCoordArray)
  },
  [Actions.CLEAR_PIXEL_ARRAY] (state) {
    state.pixelCoordArray = []
    console.dir(state.pixelCoordArray)
  }
}

export const store = new Vuex.Store({
  state,
  actions,
  mutations
})
