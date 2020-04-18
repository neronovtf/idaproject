<template>
    <div>
        <div class="title">Table UI</div>
        <div class="panel">
            <div class="sort">
                <div class="sort-title">Sorting by:</div>
                <div
                    class="sort-item"
                    v-for="(column, index) in this.$store.state.columns"
                    :key="index"
                    :class="{'sort-active': column.isActive}"
                    @click="selectFirstColumn(column.title)"
                    > 
                    {{column.title}}
                </div>
            </div>
            <div class="buttons">
                <div
                    class="button-delete"
                    :class="{'button-delete__active':activeButtonDelete}"
                    @click.self="deleteRows($event)"
                >
                    Delete
                    <span v-if="activeButtonDelete">({{activeButtonDelete}})</span>
                    <div class="main-popup"></div>
                    <!-- <VuePopup v-if="this.$store.state.popup.show"  :is="this.$store.state.popup.show"/> -->
                    <!-- <component :is="this.$store.getters.kill" class="tab"></component> -->
                </div>
                <div class="page">
                    <div class="dropdown-button">
                        {{this.$store.state.countItems.selectedValue}} Per Page
                    </div>
                    <div class="content">
                        <div
                            v-for="column in this.$store.state.countItems.valuesList" 
                            :key="column.id"
                            :value="column.id"
                            :class="getClass(column.name)"
                            @click="selectCountPer(column.name)"
                        >
                        {{column.name}}  Per Page
                        </div>
                    </div>
                </div>
                <div class="show_count-items">
                    <!-- <div :class="'arrow-left' {'active': this.$store.state.showPage}"></div> -->
                    <div
                        :class="'arrow-left '+getMinArrowClass()"
                        @click="clickArrowMin()"
                    ></div>
                    <div class="text">
                        {{calculateMinValue()}}
                         - 
                        {{calculateMaxValue()}}
                         of 
                        {{this.$store.state.showRows.length}}
                    </div>
                    <div
                        :class="'arrow-right '+getMaxArrowClass()"
                        @click="clickArrowMax()"
                    ></div>
                </div>
                <div class="dropdown__show-colunms">
                    <div class="dropdown-button">{{countSelectColumns}} columns selected</div>
                    <div class="dropdown-content">
                        <label class="container all-select">
                            <input type="checkbox" v-model="allSelectColumns">
                            <span class="checkmark"></span>
                            Select all
                        </label>
                        <label
                            v-for="(column, index) in this.$store.state.columns" 
                            :key="index"
                            class="container" 
                        >
                            <input type="checkbox" v-model="column.isShow">
                            <span class="checkmark"></span>
                            {{column.title}}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
        }
    },
    created() {
        this.$store.commit('runServer');
    },
    computed:{
        countSelectColumns(){
            // return 
            return this.$store.getters.getLengthActiveColumn
            // const columns = this.$store.state.columns.filter(column => column.isShow);
            // return columns.length
        },
        allSelectColumns: {
            get: function () {
                const countSelect = this.$store.state.columns.filter(column => column.isShow).length
                return countSelect == this.$store.state.columns.length
            },
            set: function (selectAll) {
                const columns = this.$store.state.columns
                columns.forEach(function(column) {
                    column.isShow = selectAll
                });
            }
        },
        activeButtonDelete: function(){
            return this.$store.state.selectRowsByID.length
        }
    },
    methods: {
        selectCountPer(value){
            this.$store.state.countItems.selectedValue = value
        },
        getClass(value){
            let nameClass = 'container'
            nameClass += value == this.$store.state.countItems.selectedValue ? ' active' : ''
            return nameClass
        },
        getMinArrowClass(){
            return this.$store.state.showPage ? 'active' : ''
        },
        getMaxArrowClass(){
            const allRows = this.$store.state.showRows.length
            const rowsPerPage = +this.$store.state.countItems.selectedValue
            const numberPage = this.$store.state.showPage + 1

            if(allRows > 0){
                const comparison = Math.ceil(allRows/rowsPerPage) == numberPage
                return comparison ? '' : 'active'
            }
            else
                return 'arrow-right'
            // const comparison = 
            // this.$store.state.showPage ? 'arrow-right_active' : 'arrow-right'
        },
        calculateMinValue(){
            const allRows = this.$store.state.showRows.length
            const rowsPerPage = +this.$store.state.countItems.selectedValue
            const numberPage = this.$store.state.showPage+1

            if(allRows>0){
                return numberPage * rowsPerPage - rowsPerPage + 1
            }
            else return 0
        },
        calculateMaxValue(){
            const allRows = this.$store.state.showRows.length
            const rowsPerPage = +this.$store.state.countItems.selectedValue
            const numberPage = this.$store.state.showPage+1

            if(allRows>0){
                const max = numberPage * rowsPerPage
                return max > allRows ? allRows : max
            }
            else return 0
        },
        clickArrowMin(){
            this.$store.state.showPage > 0 ? --this.$store.state.showPage : ''
        },
        clickArrowMax(){
            const numberPage = this.$store.state.showPage
            const allRows = this.$store.state.showRows.length
            const countRowAtPage = +this.$store.state.countItems.selectedValue

            // const allRows = this.$store.state.showRows.length
            // const rowsPerPage = +this.$store.state.countItems.selectedValue
            // const numberPage = this.$store.state.showPage

            if(allRows > 0){
                const comparison = Math.ceil(allRows/countRowAtPage) != numberPage
                return comparison ? ++this.$store.state.showPage : ''
            }
            // else
            //     return 'arrow-right'


            // this.$store.state.showPage > 0 ? --this.$store.state.showPage : ''
        },
        selectFirstColumn(title){

            // console.log('Zs - '+title);
            this.$store.commit('setOrderColumns', title);
            // this.$store.mutations.setOrderColumns(title)
            
        },
        deleteRows(elem){
            if(this.$store.state.selectRowsByID.length > 0){
                this.$store.commit('setPosition', elem);
            }
        }
    }
}
</script>

<style scoped>
.title{
    font-weight: 600;
    font-size: 32px;
    line-height: 40px;
    color: #282136;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #EDEDED;
}
.panel{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
    /* padding-bottom: 5px; */
}
.sort{
    /* font-size: 14px; */
    /* line-height: 24px; */
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}
.sort-title{
    font-weight: 600;
    margin-right: 8px;
}
.sort-item{
    margin-right: 13px;
    cursor: pointer;
}
.sort-active{
    background-color: #00A11E;
    border-radius: 2px;
    color: white;
    padding: 3px 5px;
    cursor: default;
}
.buttons{
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}
.button-delete{
    opacity: 0.4;
    /* padding: 3px 5px; */
    padding: 2px 7px;
    border: 1px solid #C6CBD4;
    border-radius: 2px;
    margin-right: 12px;
    /* position: relative; */
}
.button-delete__active{
    background: #00A11E;
    color: #FFFFFF;
    cursor: pointer;
    opacity: 1;
    /* border-radius: 2px; */
}

/* ======================================= */
.page{
    position: relative;
    display: inline-block;
    margin-right: 16px;
}
.page:hover .content {
    display: block;
}
.page .content{
    /* min-width: 100px; */
    /* max-height: 90px; */
    display: none;
    position: absolute;
    background-color: white;
    min-width: 100px;
    /* height: 243px; */
    overflow-y: auto;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    padding: 15px 0px;
}
.page .container{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
}
.page .container:hover{
    background-color: #f3f0f0;
}
.page .active{
    font-weight: bold;
}
/* ======================================= */


.show_count-items{
    display: flex;
    align-items: center;
}
.arrow-left, .arrow-right{
    border: 1px solid #C6CBD4;
    border-radius: 2px;
    width: 28px;
    height: 28px;
    opacity: .4;
}
.arrow-left.active, .arrow-right.active{
    opacity: 1;
    cursor: pointer;
}
.arrow-left{
    background: transparent url(../assets/Left.png) 50% center no-repeat;
    margin-right: 8px;
}
.text{
    margin-right: 8px;
}
.arrow-right{
    background: transparent url(../assets/Right.png) 50% center no-repeat;
    margin-right: 16px;
}



.dropdown__show-colunms{
    position: relative;
    display: inline-block;
}
.dropdown__show-colunms:hover .dropdown-content {
    display: block;
}
.dropdown-button{
    border: 1px solid #C6CBD4;
    border-radius: 2px;
    background: transparent url(../assets/Down.png) 98% center no-repeat;
    padding-right: 25px;
    padding: 2px 25px 2px 7px;
    cursor: pointer;
}
.dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 207px;
    height: 243px;
    overflow-y: auto;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    padding: 15px 0px;
}

.dropdown-content span:hover {
    background-color: #f1f1f1
}



/* .dropdown__show-colunms:hover .dropdown-button {
    background-color: #3e8e41;
} */


.container {
  /* display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none; */
  user-select: none;
  cursor: pointer;
  position: relative;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.container.all-select{
    font-weight: 600;
}
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  height: 14px;
  width: 14px;
  margin: 10px;
  /* background-color: #eee; */
  border-radius: 2px;
  /* border: 1.5px solid silver; */
  border: 1px solid #C6CBD4;
}
/* .container:hover input ~ .checkmark {
  background-color: #ccc;
} */
.container input:checked ~ .checkmark {
  background-color: #00A11E;
  /* background-color: white; */
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
} 
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
    left: 15px;
    top: 11px;
    width: 3px;
    height: 8px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}


</style>