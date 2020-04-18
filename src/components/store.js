import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import * as Request from './request'

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
    countItems:{
      selectedValue: 10,
      valuesList: [
          { name: '10' },
          { name: '15' },
          { name: '20' },
      ]
    },
    popup:{
      show: false,
      X: 0,
      Y: 0
      // html: `<div class="timmi">{{this.$store.state.popup.text}}</div>`
    },
    selectRowsByID:[],
    server: {
      getData: 'connect', // 'connect', 'error', 'allow'
      errorGet: 0,
      delete: 'allow', // 'connect', 'error', 'allow'
      errorDel: 0
    },
    showPage: 0,
    showRows: [],
    countSelectItems: 0,
    countItemsPage: 10,
    products: [],
  },
  
  getters: {
    filterBooks: state => {
      let books
      switch (state.activeType) {
        case 0: books = state.books; break;
        case 1: books = state.books.filter(book => book.myBook); break;
        case 2: books = state.books.filter(book => book.ILike); break;
      }
      if(state.searchText.length){
        books = books.filter(book => {
          const findByTitle = !!~book.title.toLowerCase().indexOf(state.searchText.toLowerCase())
          const findByAuthor = !!~book.author.toLowerCase().indexOf(state.searchText.toLowerCase())
          return findByTitle || findByAuthor
        })
      }
      state.showBooks = books
    },
    // getRowsShow: state => {
    //   const rowsInPage = +state.countItems.selectedValue
    //   const numberPage = +state.showPage + 1
    //   const Y = rowsInPage * numberPage
    //   const X = Y - rowsInPage
    //   return state.showRows.slice(X, Y)
    // },
    getLengthActiveColumn: state => {
      // const columns = state.columns.filter(column => column.isShow);
      return state.columns.filter(column => column.isShow).length
    },
    getNameActiveColumns: state => {
      return state.columns.filter(column => column.isShow)
    },
    getColumnsOrder: state => {
      const columns = state.columns.filter(column => column.isShow)
      return columns.sort((a,b) => a.order > b.order ? 1 : -1)
    },
    getRowsSortByColumn: state => {
      const rowsInPage = +state.countItems.selectedValue
      const numberPage = +state.showPage + 1

      const ColumnsBySort = state.columns.filter(column => column.isActive)
      const nameColumnBySort = ColumnsBySort[0].title.toLowerCase()

      const Y = rowsInPage * numberPage
      const X = Y - rowsInPage

      const sortRows =  state.showRows.sort((a,b) => {
        if(state.sortFirstColumn == 'ASC'){
          return a[nameColumnBySort] > b[nameColumnBySort] ? 1 : -1
        }
        else{
          return a[nameColumnBySort] > b[nameColumnBySort] ? -1 : 1
        }
      })

      return sortRows.slice(X, Y)
    },
    getStatusRow: state => typeSort => {
      console.log(state);
      console.log(typeSort);
    },
    getWtf: state => {
      console.log('getWtf');
      
      console.log(state);
      
    }
  },
  
  mutations: {
    runServer(state){
      Request.getProducts().then(
        data => {
          state.server.getData = 'allow'
          state.server.errorGet = 0
          state.showRows = data
        },
        error => {
          console.log(error.error);
          ++state.server.errorGet
          state.server.getData = 'error'
        }
      )
    },
    setOrderColumns(state, nameFirstColumn){
      let index = 0
      state.columns.forEach(function(column) {
        if(column.title == nameFirstColumn){
          column.order = 0;
          column.isActive = true
        }
        else{
          column.order = ++index
          column.isActive = false
        }
      });
    },
    selectShowRows(state){
      if(state.selectRowsByID.length != state.countItems.selectedValue){
        const rowsInPage = +state.countItems.selectedValue
        const numberPage = +state.showPage + 1
        const Y = rowsInPage * numberPage
        const X = Y - rowsInPage
        const rows = state.showRows.slice(X, Y)
  
        state.selectRowsByID = []
        rows.forEach(function(row) {
          state.selectRowsByID.push(row.id)
        })
      }
      else{
        state.selectRowsByID = []
      }
    },
    setPosition(state, elem){
      const target = elem.target.getBoundingClientRect()
      const width = target.width
      const left = target.left
      const allWidth = window.innerWidth
      const rightEdge = left + width + 125
      const halfWidth = Math.round(width/2)
      const X = target.top + target.height + 10
      let Y = left + halfWidth - 125
      if(Y < 0) Y = left
      if(rightEdge > allWidth) Y = Y + halfWidth - 125
      state.popup.X = X
      state.popup.Y = Y
      state.popup.show = true
    },
    addRowInSelect(state, arg){
      const idRow = arg.id
      const index = state.selectRowsByID.indexOf(idRow)
      let isDelete 
      switch (arg.option) {
        case 'all-add': isDelete = false; break;
        default: isDelete = true; break;
      }
      
      if(index == -1){
        state.selectRowsByID.push(idRow)
      }
      else{
        if(isDelete){
          state.selectRowsByID.splice(index, 1)
        }
      }
      
    },
  },

  actions: {
    deleteSelectRows(global){
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
    realDelete(global){
      const state = global.state
      let idRows = state.selectRowsByID
      console.log('1. '+state.showRows.length);   
      console.log(idRows.length);
         
      state.showRows = state.showRows.filter(item => !~idRows.indexOf(item.id))

      console.log('2. '+state.showRows.length);      
      state.server.showPage = 0
      global.getters.getRowsSortByColumn
      state.server.delete = 'allow'
      state.popup.show = false
      state.selectRowsByID = []
    }
  },
});