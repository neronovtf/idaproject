<template>
  <div id="app">
    <VueHead/>
    <VueTable/>
    <VuePopup/>
  </div>
</template>

<script>
import VueHead from './components/VueHead.vue'
import VueTable from './components/VueTable.vue'
import VuePopup from './components/VuePopup.vue'

export default {
  name: 'App',
  components: {
    VueHead,
    VueTable,
    VuePopup
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap');
body{
  margin: 0px;
  padding: 0px;
  border: none;
  outline: none;
}
body, select{
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  line-height: 24px;

  background-color: #fbfbfb;
  color: #3D374A;
}
#app {
  margin: 2% 7%;
}
</style>
