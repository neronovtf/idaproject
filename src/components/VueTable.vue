<template>
    <div>
        <table>
            <tr class="head">
                <th class="check-box"  @click="selectShowRows()">
                    <div
                        :class="{'active': selectAllRows}"
                    >
                        <div></div>
                    </div>
                </th>
                <th
                    v-for="(column, index) in getColumns" 
                    :key="index"
                    :class="column.order == 0 ? 'first': ''"
                    @click="sortFirstColumn(column, $event, column.order == 0)"
                >
                    {{column.title}}
                    <div
                        v-if="column.order == 0"
                        class="img-arrow up"
                    ></div>
                </th>
                <th></th>
            </tr>
            <template v-if="getStatusServer == 'allow'">
                <tr
                    v-for="row in getRows" 
                    :key="row.id"
                    @click="clickCheck($event,row.id)"
                    class="row"
                >
                    <td
                        class="check-box"
                        :idRow="row.id"
                    >
                        <div
                            :class="{'active': ~selectRows.indexOf(row.id)}"
                        >
                            <div></div>
                        </div>
                    </td>
                    <td
                        v-for="(column, index) in getColumns" 
                        :key="index"
                    >
                        {{gluing(row, column)}}
                    </td>
                    <td class="for-del">
                        <div
                            class="delete"
                            @click.self.prevent="deleteRows($event, row.id)"
                        >
                            delete
                            <!-- <VuePopup v-if="this.$store.state.popup.show" /> -->
                        </div>
                    </td>
                </tr>
            </template>
            <template v-else-if="getStatusServer == 'connect'">
                <tr>
                    <td :colspan="this.$store.getters.getLengthActiveColumn+2">
                        <div class="table-error connect">
                            <div class="text">Server connection ...</div>
                        </div>
                    </td>
                </tr>
            </template>
            <template v-else-if="getStatusServer == 'error'">
                <tr>
                    <td :colspan="this.$store.getters.getLengthActiveColumn+2">
                        <div class="table-error" @click="repeatConnect()">
                            <div class="img"></div>
                            <div class="text">Server error. Repeat again ({{this.$store.state.server.errorGet}})?</div>
                        </div>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
    // import VuePopup from './VuePopup.vue'
    // const vm = this
    export default {
        data(){
            return{
                showPopup: false,
                // sort: 'ASC',
                idRow: '',
                // TiCount: Object.keys(this.$store.state.selectRowsByID).length
                // isCheck: false
            }
        },
        computed:{
            getStatusServer: function(){
                return this.$store.state.server.getData
            },
            getColumns: function(){
                return this.$store.getters.getColumnsOrder
            },
            getRows: function(){
                return this.$store.getters.getRowsSortByColumn;
            },
            selectRows: function(){
                return this.$store.state.selectRowsByID
            },
            selectAllRows: function(){
                return this.$store.state.selectRowsByID.length == this.$store.state.countItems.selectedValue
            }
        },
        methods: {
            repeatConnect(){

                // console.log('repeatConnect');
                this.$store.commit('runServer');
                
            },
            gluing(objRow, objColumn){
                return objColumn.isShow ? objRow[objColumn.title.toLowerCase()] : ''
            },
            clickCheck(elem, idRow) {
                // console.log(elem.target.classList);
                if(!elem.target.classList.contains('delete')){
                    this.$store.commit('addRowInSelect', {
                        id: idRow
                    })
                    // this.$store.getters.addRowInSelect(idRow)
                }
            },
            sortFirstColumn(column, elem, isFirstColumn){
                if(isFirstColumn){
                    const target = elem.target
                    let child = (target.className == 'first' ? elem.target.children[0] : elem.toElement)
                    const sort = child.classList.contains('up') ? 'DESC' : 'ASC'
                    child.classList.remove(sort == 'ASC' ? 'down' : 'up');
                    child.classList.add(sort == 'ASC' ? 'up' : 'down');
                    this.$store.state.sortFirstColumn = sort
                }
            },
            selectShowRows(){
                this.$store.commit('selectShowRows')
            },
            deleteRows(elem, idRow){
                this.$store.commit('addRowInSelect', {
                    id: idRow,
                    option: 'all-add'
                })
                elem.target.classList.add('show-delete')
                this.$store.commit('setPosition', elem);
            }
        },
        // watch: {
        //     sort: function(){
        //         this.getRows
        //     }
        // }
    }
</script>

<style scoped>
.server-error{
    background-color: #E55B5B;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td, th {
  text-align: left;
  padding: 12px 8px;
}
th.first{
    display: flex;
    color: #00A11E;
    cursor: pointer;
}
.for-del{
    display: flex;
    justify-content: center;
}
.img-arrow{
    display: inline-block;
    width: 24px;
    height: 24px;
}
.img-arrow.up{
    background: transparent url(../assets/ArrowUp.png) 50% center no-repeat;
}
.img-arrow.down{
    background: transparent url(../assets/ArrowDown.png) 50% center no-repeat;
}
.check-box{
  height: 100%;
  cursor: pointer;
}
.check-box div{
	width: 12px;
    height: 12px;
    margin: auto;
    /* border: 1px solid green; */
    border: 1px solid #C6CBD4;
}
.check-box .active{
    background-color: #00A11E;
}
.check-box .active div{
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
.head{
    height: 56px;
    border-bottom: 1px solid #EDEDED;
    background-color: white;
}
.row:nth-child(2n) {
  background-color: #F8F9FA;
  background-color: white;
}
.delete{
    /* display: none; */
    opacity: 0;
    background: transparent url(../assets/Trash.png) -10% center no-repeat;
    padding-left: 15px;
    color: #5B5E77;
}
.row{
    cursor: pointer;
}
.row:hover{
    background-color: #edf9ef;
}
.show-delete{
    opacity: 1;
}
.row:hover .delete{
    opacity: 1;
}

.table-error{
    width: 100%;
    height: 250px;

    /* background-color: mediumslateblue; */
    /* color: white; */

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    cursor: pointer;
}
.img{
    width: 100px;
    height: 100px;
    background-image: url(../assets/Replay.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-bottom: 20px;
}
.text{
    font-size: 16px;
    color: darkgray;
    font-weight: bold;
}
.conncet .text{
    font-size: 20px;
}
</style>