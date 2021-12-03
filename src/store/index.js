import Vue from 'vue'
import Vuex from 'vuex'
import { Actions } from '../actions'
import axios from 'axios'
import { PublicFields } from '@smontero/ppp-common'
import account from './account'

Vue.use(Vuex)

const hyperion = axios.create({
  baseURL: `https://${process.env.VUE_APP_HYPERION}/`
})

const profiles = {}

const state = {
  config: null,
  contractAccount: null,
  width: 1000,
  height: 1000,
  mouseX: null,
  mouseY: null,
  contract: process.env.VUE_APP_CONTRACT,
  canvasse: null,
  count: 0,
  api: null,
  lastRefresh: null,
  activeColorInt: null,
  activeColorName: null,
  activeColorHex: null,
  reloading: false,
  sendingTransaction: false,
  pixelCoordArray: [], // contains absolute pixel position ( y * 1000 + x)
  intColorArray: [],
  pixelObjArray: [], // contains array of session { x: , y: , color: <string>}
  zoomLevel: null,
  paintHistory: [],
  paintHistoryLength: 500,
  pixelsRemaining: null,
  leaderboard: [],
  cooldownExpire: -1,
  chatHistory: [],
  chatHistoryLength: 1000
}

function limitArrayLength (a, l) {
  if (a.length < l) return
  a.splice(l, (a.length - l))
}

async function getAccountProfiles (accountNames) {
  let foundAccounts = {}
  let neededAccountNames = []

  accountNames.forEach((name) => {
    if (profiles.hasOwnProperty(name)) {
      foundAccounts[name] = profiles[name]
    } else {
      neededAccountNames.push(name)
    }
  })

  if (neededAccountNames.length > 0) {
    // const response = await profileApi.getProfiles(neededAccountNames)
    // TODO: add profiles back from new profile table
    const response = []
    for (let account in response) {
      let profile = response[account]
      if (!profile || !profile.publicData) {
        continue
      }

      let avatarImage = profile.publicData[PublicFields.AVATAR_IMAGE]
      let s3Ident = profile.publicData[PublicFields.S3_IDENTITY]
      if (!avatarImage || !s3Ident) {
        continue
      }

      /*
      await PPP.profileApi().getImageUrl(avatarImage, s3Ident).then((url) => {
        profile.avatar = url
      })
       */
    }
    Object.assign(foundAccounts, response)
  }

  return foundAccounts
}

const getters = {
  getAccountProfiles: async (state) => async (accountNames) => {
    return getAccountProfiles(accountNames)
  }
}

const actions = {
  async [Actions.LOAD_CONTRACT_CONFIG] ({ commit }) {
    await commit(Actions.LOAD_CONTRACT_CONFIG)
  },
  [Actions.LOAD_CONTRACT_ACCOUNT] ({ commit }, account) {
    commit(Actions.LOAD_CONTRACT_ACCOUNT, account)
  },
  [Actions.SET_LAST_REFRESH] ({ commit }, lastRefresh) {
    commit(Actions.SET_LAST_REFRESH, lastRefresh)
  },
  [Actions.SET_SENDING_TRANSACTION] ({ commit }, isSending) {
    commit(Actions.SET_SENDING_TRANSACTION, isSending)
  },
  [Actions.SET_CANVASSE] ({ commit }, canvasse) {
    commit(Actions.SET_CANVASSE, canvasse)
  },
  [Actions.INCREMENT] ({ commit }) {
    commit(Actions.INCREMENT)
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
  [Actions.REMOVE_PIXEL_FROM_ARRAY] ({ commit }, pixelObj) {
    commit(Actions.REMOVE_PIXEL_FROM_ARRAY, pixelObj)
  },
  [Actions.CLEAR_PIXEL_ARRAY] ({ commit }) {
    commit(Actions.CLEAR_PIXEL_ARRAY)
  },
  [Actions.SET_MOUSE_COORDS] ({ commit }, pixelObj) {
    commit(Actions.SET_MOUSE_COORDS, pixelObj)
  },
  [Actions.SET_ZOOM_LEVEL] ({ commit }) {
    commit(Actions.SET_ZOOM_LEVEL)
  },
  [Actions.PUSH_CHAT_HISTORY] ({ commit }, historyObj) {
    commit(Actions.PUSH_CHAT_HISTORY, historyObj)
  },
  [Actions.LOAD_PAINT_HISTORY] ({ commit }) {
    commit(Actions.LOAD_PAINT_HISTORY)
  },
  [Actions.LOAD_LEADERBOARD] ({ commit }) {
    commit(Actions.LOAD_LEADERBOARD)
  },
  [Actions.SET_PIXELS_REMAINING] ({ commit }, pixels) {
    commit(Actions.SET_PIXELS_REMAINING, pixels)
  },
  [Actions.SET_COOLDOWN_EXPIRES] ({ commit }, expires) {
    commit(Actions.SET_COOLDOWN_EXPIRES, expires)
  }
}

const mutations = {
  async [Actions.LOAD_CONTRACT_CONFIG] (state) {
    let contract = state.contract
    let configResponse = await store['$api'].getRpc().get_table_rows({
      code: contract,
      scope: contract,
      table: 'config'
    })
    if (configResponse.rows.length) {
      state.config = configResponse.rows[0]
    }
  },
  async [Actions.LOAD_CONTRACT_ACCOUNT] (state) {
    if (!this.$type === 'ual') { return }

    let accountName = this.state.account.accountName
    let contract = state.contract
    let acctResponse = await store['$api'].getRpc().get_table_rows({
      code: contract,
      scope: contract,
      table: 'accounts',
      lower_bound: accountName,
      limit: 1
    })

    if (acctResponse.rows.length) {
      state.contractAccount = acctResponse.rows[0]
    }
  },
  [Actions.SET_LAST_REFRESH] (state, lastRefresh) {
    state.lastRefresh = lastRefresh
  },
  [Actions.SET_SENDING_TRANSACTION] (state, isSending) {
    state.sendingTransaction = isSending
  },
  [Actions.SET_CANVASSE] (state, canvasse) {
    state.canvasse = canvasse
  },
  [Actions.INCREMENT] (state) {
    state.count++
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
    // the mouse listeners are doubling up for some reason, temp fix @TODO
    let index = state.pixelCoordArray.indexOf((pixelObj.y * 1000) + pixelObj.x)
    if (index < 0) {
      state.pixelCoordArray.push((pixelObj.y * 1000) + pixelObj.x)
      state.intColorArray.push(state.activeColorInt)
      state.pixelObjArray.push({ x: pixelObj.x, y: pixelObj.y, color: state.activeColorName })
      console.dir(state.pixelCoordArray)
    }
  },
  [Actions.REMOVE_PIXEL_FROM_ARRAY] (state, pixelObj) {
    let index = state.pixelCoordArray.indexOf((pixelObj.y * 1000) + pixelObj.x)
    if (index > -1) {
      state.pixelCoordArray.splice(index, 1)
      state.intColorArray.splice(index, 1)
      state.pixelObjArray.splice(index, 1)
    }
  },
  [Actions.CLEAR_PIXEL_ARRAY] (state) {
    state.pixelCoordArray = []
    state.intColorArray = []
    state.pixelObjArray = []
    console.dir(state.pixelCoordArray)
  },
  [Actions.SET_MOUSE_COORDS] (state, coords) {
    state.mouseX = coords.x
    state.mouseY = coords.y
  },
  [Actions.SET_ZOOM_LEVEL] (state, zoomLevel) {
    state.zoomLevel = zoomLevel
  },
  [Actions.PUSH_CHAT_HISTORY] (state, chat) {
    Vue.set(state.chatHistory, state.chatHistory.length, chat)
    limitArrayLength(state.chatHistory, state.chatHistoryLength)
  },
  [Actions.LOAD_PAINT_HISTORY] (state, paint) {
    hyperion.get(`v2/history/get_actions?track=50&filter=${process.env.VUE_APP_CONTRACT}%3Asetpixels&sort=desc`).then(async response => {
      let accounts = []
      for (let i = 0; i < response.data.actions.length; i++) {
        let account = response.data.actions[i].act.data.account_name
        if (!accounts.includes(account)) {
          accounts.push(account)
        }
      }

      let historyProfiles = await getAccountProfiles(accounts)
      for (let i = 0; i < response.data.actions.length; i++) {
        let account = response.data.actions[i].act.data.account_name
        if (historyProfiles.hasOwnProperty(account)) {
          response.data.actions[i].act.data.avatar = historyProfiles[account].avatar
        }
      }
      state.paintHistory = response.data.actions
    })
  },
  async [Actions.LOAD_LEADERBOARD] (state) {
    // TODO: once nodeos is 1.5 and eosjs supports it, reverse sort the table search and don't sort locally
    let contract = state.contract
    let leaderboardResponse = await store['$api'].getRpc().get_table_rows({
      code: contract,
      scope: contract,
      table: 'accounts',
      index_position: 2,
      key_type: 'i64',
      limit: 5000
    })

    if (leaderboardResponse.rows.length) {
      leaderboardResponse.rows.sort(function (a, b) {
        return b.paint_score - a.paint_score
      })
    } else {
      return
    }

    let leaderboard = leaderboardResponse.rows
    let accountNames = []
    for (let i = 0; i < leaderboard.length; i++) {
      accountNames.push(leaderboard[i].account_name)
    }
    let leaderProfiles = await getAccountProfiles(accountNames)
    for (let i = 0; i < leaderboard.length; i++) {
      if (leaderProfiles.hasOwnProperty(leaderboard[i].account_name)) {
        leaderboard[i].avatar = leaderProfiles[leaderboard[i].account_name].avatar
      }
    }
    state.leaderboard = leaderboard
  },
  [Actions.SET_PIXELS_REMAINING] (state, pixels) {
    state.pixelsRemaining = pixels
  },
  [Actions.SET_COOLDOWN_EXPIRES] (state, expires) {
    state.cooldownExpire = expires
  }
}

export const store = new Vuex.Store({
  modules: {
    account
  },
  state,
  actions,
  mutations,
  getters
})
