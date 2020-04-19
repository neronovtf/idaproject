<template>
  <div>
    <table>
      <tr class="head">
        <th class="check-box" @click="clickSelectAllRows()">
          <div :class="{'active':selectAllRows}">
            <div></div>
          </div>
        </th>
        <th
          v-for="(column, index) in getColumns"
          :key="index"
          :class="column.order == 0 ? 'first': ''"
          @click="clickSortFirstColumn()"
        >
          {{column.title}}
          <div
            v-if="column.order == 0"
            class="img-arrow"
            :class="{'up' : typeSort == 'ASC','down': typeSort == 'DESC'}"
          ></div>
        </th>
        <th></th>
      </tr>
      <template v-if="getStatusServer == 'allow'">
        <tr v-for="row in getRows" :key="row.id" @click="clickCheck($event,row.id)" class="row">
          <td class="check-box">
            <div :class="{'active': ~selectRows.indexOf(row.id)}">
              <div></div>
            </div>
          </td>
          <td v-for="(column, index) in getColumns" :key="index">{{gluing(row, column)}}</td>
          <td class="for-del">
            <div class="delete" @click.self.prevent="deleteRows($event, row.id)">delete</div>
          </td>
        </tr>
      </template>
      <template v-else-if="getStatusServer == 'connect'">
        <tr>
          <td :colspan="this.$store.getters.getActiveColumns.length+2">
            <div class="table-error connect">
              <div class="text">Server connection ...</div>
            </div>
          </td>
        </tr>
      </template>
      <template v-else-if="getStatusServer == 'error'">
        <tr>
          <td :colspan="this.$store.getters.getActiveColumns.length+2">
            <div class="table-error" @click="clickRepeatConnect()">
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
export default {
  data() {
    return {};
  },
  computed: {
    getStatusServer: function() {
      const message = this.$store.state.server.getData;
      if (message == "allow") {
        this.$store.getters.sortBy;
      }
      return message;
    },
    getColumns: function() {
      return this.$store.getters.getColumnsOrder;
    },
    getRows: function() {
      return this.$store.getters.getShowRows;
    },
    getShowRows: function() {
      return this.$store.getters.getShowRows;
    },
    selectAllRows: function() {
      const showRows = this.getShowRows.length;
      return showRows ? showRows == this.selectRows.length : false;
    },
    selectRows: {
      get: function() {
        return this.$store.state.selectRowsByID;
      },
      set: function(idRow) {
        this.$store.state.selectRowsByID.push(idRow);
      }
    },
    typeSort: {
      get: function() {
        return this.$store.state.sortFirstColumn;
      },
      set: function(typeSort) {
        this.$store.state.sortFirstColumn = typeSort;
        this.$store.getters.sortBy;
      }
    }
  },
  methods: {
    clickRepeatConnect() {
      this.$store.commit("runServer");
    },
    gluing(objRow, objColumn) {
      return objColumn.isShow ? objRow[objColumn.title.toLowerCase()] : "";
    },
    clickCheck(elem, idRow) {
      if (!elem.target.classList.contains("delete")) {
        this.$store.commit("addRowInSelect", idRow);
      }
    },
    clickSortFirstColumn() {
      this.$store.commit("resetSelection");
      this.typeSort = this.typeSort == "ASC" ? "DESC" : "ASC";
      this.$store.getters.sortBy;
    },
    clickSelectAllRows() {
      const compare = this.selectAllRows;
      this.$store.state.selectRowsByID = [];
      if (!compare) {
        const vm = this;
        this.$store.getters.getShowRows.forEach(function(row) {
          vm.selectRows = row.id;
        });
      }
    },
    deleteRows(elem, idRow) {
      this.$store.commit("anywayAddIdInSelect", idRow);
      elem.target.classList.add("show-delete");
      this.$store.commit("setPosition", elem);
    }
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
}
td, th {
  text-align: left;
  padding: 12px 8px;
}
th.first {
  display: flex;
  color: #00a11e;
  cursor: pointer;
  user-select: none;
}
.for-del {
  display: flex;
  justify-content: center;
}
.img-arrow {
  display: inline-block;
  width: 24px;
  height: 24px;
}
.img-arrow.up {
  background: transparent url(../assets/ArrowUp.png) 50% center no-repeat;
}
.img-arrow.down {
  background: transparent url(../assets/ArrowDown.png) 50% center no-repeat;
}
.check-box {
  height: 100%;
  cursor: pointer;
}
.check-box div {
  width: 12px;
  height: 12px;
  margin: auto;
  border: 1px solid #c6cbd4;
}
.check-box .active {
  background-color: #00a11e;
}
.check-box .active div {
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.head {
  height: 56px;
  font-size: 15px;
  border-bottom: 1px solid #ededed;
  background-color: white;
}
.row:nth-child(2n) {
  background-color: white;
}
.delete {
  opacity: 0;
  background: transparent url(../assets/Trash.png) -10% center no-repeat;
  padding-left: 15px;
  color: #5b5e77;
}
.row {
  cursor: pointer;
}
.row:hover {
  background-color: #edf9ef;
}
.show-delete {
  opacity: 1;
}
.row:hover .delete {
  opacity: 1;
}
.table-error {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}
.img {
  width: 100px;
  height: 100px;
  background-image: url(../assets/Replay.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
}
.text {
  font-size: 16px;
  color: #5a5858;
}
.conncet .text {
  font-size: 20px;
}
</style>