import Vuex from 'vuex'
import Vue from 'vue'
import * as Request from './request'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    columns: [
      { title: "Product", isActive: true, isShow: true, order: 0 },
      { title: "Calories", isActive: false, isShow: true, order: 1 },
      { title: "Fat", isActive: false, isShow: true, order: 2 },
      { title: "Carbs", isActive: false, isShow: true, order: 3 },
      { title: "Protein", isActive: false, isShow: true, order: 4 },
      { title: "Iron", isActive: false, isShow: true, order: 5 },
    ],
    sortFirstColumn: 'ASC',
    countItems: {
      selectedValue: 10,
      valuesList: [
        { name: '10' },
        { name: '15' },
        { name: '20' },
      ]
    },
    popup: {
      show: false,
      X: 0,
      Y: 0
    },
    selectRowsByID: [],
    server: {
      getData: 'connect', // 'connect', 'error', 'allow'
      errorGet: 0,
      delete: 'allow', // 'connect', 'error', 'allow'
      errorDel: 0
    },
    showPage: 0,
    getJson: [],
  },
  //               _   _                
  //              | | | |               
  //     __ _  ___| |_| |_ ___ _ __ ___ 
  //    / _` |/ _ \ __| __/ _ \ '__/ __|
  //   | (_| |  __/ |_| ||  __/ |  \__ \
  //    \__, |\___|\__|\__\___|_|  |___/
  //     __/ |                          
  //    |___/                           
  getters: {
    getAllLength: state => {
      return state.getJson.length
    },
    getCountRows: state => {
      return +state.countItems.selectedValue
    },
    getShowRows: (state, getters) => {
      return state.getJson.slice(getters.getLeftEdge, getters.getRightEdge)
    },
    getLeftEdge: (state, getters) => {
      return state.showPage * getters.getCountRows
    },
    getRightEdge: (state, getters) => {
      const max = getters.getAllLength
      if (max > 0) {
        const rightEdge = getters.getLeftEdge + getters.getCountRows
        return rightEdge > max ? max : rightEdge
      }
      else return 0
    },
    getActiveColumns: state => {
      return state.columns.filter(column => column.isShow)
    },
    getColumnsOrder: (state, getters) => {
      return getters.getActiveColumns.sort((a, b) => a.order > b.order ? 1 : -1)
    },
    sortBy(state) {
      const columnsBySort = state.columns.filter(column => column.isActive)
      const expression = columnsBySort[0].title.toLowerCase()
      const asc = state.sortFirstColumn == 'ASC'
      state.getJson.sort((a, b) => {
        let value = a[expression] > b[expression]
        return asc === value ? 1 : -1
      })
    },
  },
  //                    _        _   _                 
  //                   | |      | | (_)                
  //    _ __ ___  _   _| |_ __ _| |_ _  ___  _ __  ___ 
  //   | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \/ __|
  //   | | | | | | |_| | || (_| | |_| | (_) | | | \__ \
  //   |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/
  //                                                   
  //                                                                                                                    
  mutations: {
    runServer(state) {
      Request.getProducts().then(
        data => {
          state.server.getData = 'allow'
          state.server.errorGet = 0
          state.getJson = data
        },
        error => {
          console.log(error.error);
          ++state.server.errorGet
          state.server.getData = 'error'
        }
      )
    },
    resetSelection(state) {
      state.selectRowsByID = []
    },
    setPosition(state, elem) {
      const target = elem.target.getBoundingClientRect()
      const width = target.width
      const left = target.left
      const allWidth = window.innerWidth
      const rightEdge = left + width + 125
      const halfWidth = Math.round(width / 2)
      const X = target.top + target.height + 10
      let Y = left + halfWidth - 125
      if (Y < 0) Y = left
      if (rightEdge > allWidth) Y = Y + halfWidth - 125
      state.popup.X = X
      state.popup.Y = Y
      state.popup.show = true
    },
    anywayAddIdInSelect(state, idRow) {
      if (!~state.selectRowsByID.indexOf(idRow)) {
        state.selectRowsByID.push(idRow)
      }
    },
    addRowInSelect(state, idRow) {
      const index = state.selectRowsByID.indexOf(idRow)
      if (!~index) {
        state.selectRowsByID.push(idRow)
      }
      else {
        state.selectRowsByID.splice(index, 1)
      }
    },
  },
  //               _   _                 
  //              | | (_)                
  //     __ _  ___| |_ _  ___  _ __  ___ 
  //    / _` |/ __| __| |/ _ \| '_ \/ __|
  //   | (_| | (__| |_| | (_) | | | \__ \
  //    \__,_|\___|\__|_|\___/|_| |_|___/
  //                                     
  //                                     
  actions: {
    deleteSelectRows(global) {
      const state = global.state
      Request.deleteProducts().then(
        data => {
          console.log(data.message);
          state.server.errorDel = 0
          global.dispatch('realDelete')
        },
        error => {
          console.log(error.error);
          ++state.server.errorDel
          state.server.delete = 'error'
        }
      )
    },
    realDelete(global) {
      const state = global.state
      state.server.showPage = 0
      state.getJson = state.getJson.filter(item => !~state.selectRowsByID.indexOf(item.id))
      state.server.delete = 'allow'
      state.popup.show = false
      state.selectRowsByID = []
    }
  },
});