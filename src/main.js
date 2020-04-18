import Vue from 'vue'
import App from './App.vue'
import store from './components/store'
// import request from './components/request'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // request,
  store
}).$mount('#app')
