<template>
  <div>
    <div class="title">Table UI</div>
    <div class="panel">
      <div class="sort">
        <div class="sort-title">Sorting by:</div>
        <div
          class="sort-item"
          v-for="(column, index) in getAllColumns"
          :key="index"
          :class="{'sort-active': column.isActive}"
          @click="clickSelectFirstColumn(column.title)"
        >{{column.title}}</div>
      </div>
      <div class="buttons">
        <div
          class="button-delete"
          :class="{'active':activeButtonDelete}"
          @click.self="clickDeleteRows($event)"
        >
          Delete
          <span v-if="activeButtonDelete">({{activeButtonDelete}})</span>
          <div class="main-popup"></div>
        </div>
        <div class="page">
          <div class="dropdown-button">{{this.countItemsPerPage}} Per Page</div>
          <div class="content">
            <div
              v-for="column in this.$store.state.countItems.valuesList"
              :key="column.id"
              :value="column.id"
              :class="classForPerPage(column.name)"
              @click="clickSelectCountPer(column.name)"
            >{{column.name}} Per Page</div>
          </div>
        </div>
        <div class="show_count-items">
          <div :class="{'active': this.numberPage, 'arrow-left': true}" @click="clickArrowMin()"></div>
          <div class="text">
            {{calculateLeftEdge()}}
            -
            {{this.$store.getters.getRightEdge}}
            of
            {{this.getLengthAllRows}}
          </div>
          <div class="arrow-right" :class="classForRightArrow()" @click="clickArrowMax()"></div>
        </div>
        <div class="dropdown__show-colunms">
          <div
            class="dropdown-button"
          >{{this.$store.getters.getActiveColumns.length}} columns selected</div>
          <div class="dropdown-content">
            <label class="container all-select">
              <input type="checkbox" v-model="modelItemSelectAll" />
              <span class="checkmark"></span>
              Select all
            </label>
            <label v-for="(column, index) in getAllColumns" :key="index" class="container">
              <input type="checkbox" v-model="column.isShow" />
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
  data() {
    return {};
  },
  created() {
    this.$store.commit("runServer");
  },
  computed: {
    getAllColumns() {
      return this.$store.state.columns;
    },
    getLengthAllRows: function() {
      return this.$store.state.getJson.length;
    },
    activeButtonDelete: function() {
      return this.$store.state.selectRowsByID.length;
    },
    modelItemSelectAll: {
      get: function() {
        const countSelect = this.getAllColumns.filter(column => column.isShow)
          .length;
        return countSelect == this.getAllColumns.length;
      },
      set: function(selectAll) {
        this.getAllColumns.forEach(function(column) {
          column.isShow = selectAll;
        });
      }
    },
    countItemsPerPage: {
      get: function() {
        return +this.$store.state.countItems.selectedValue;
      },
      set: function(countItems) {
        this.$store.state.countItems.selectedValue = countItems;
      }
    },
    numberPage: {
      get: function() {
        return this.$store.state.showPage;
      },
      set: function(page) {
        this.$store.state.showPage = page;
      }
    }
  },
  methods: {
    classForPerPage(value) {
      return "container " + (value == this.countItemsPerPage ? " active" : "");
    },
    classForRightArrow() {
      return this.getLengthAllRows == this.$store.getters.getRightEdge
        ? ""
        : "active";
    },
    calculateLeftEdge() {
      const countAllRows = this.$store.getters.getAllLength;
      return countAllRows ? this.$store.getters.getLeftEdge + 1 : countAllRows;
    },
    clickSelectCountPer(value) {
      this.$store.commit("resetSelection");
      this.countItemsPerPage = value;
      this.numberPage = 0;
    },
    clickArrowMin() {
      if (this.numberPage > 0) {
        this.$store.commit("resetSelection");
        --this.numberPage;
      }
    },
    clickArrowMax() {
      if (this.getLengthAllRows != this.$store.getters.getRightEdge) {
        this.$store.commit("resetSelection");
        ++this.numberPage;
      }
    },
    clickSelectFirstColumn(title) {
      this.$store.commit("resetSelection");
      let index = 0;
      this.$store.state.sortFirstColumn = "ASC";
      this.getAllColumns.forEach(function(column) {
        if (column.title == title) {
          column.order = 0;
          column.isActive = true;
        } else {
          column.order = ++index;
          column.isActive = false;
        }
      });
      this.$store.getters.sortBy;
    },
    clickDeleteRows(elem) {
      if (this.activeButtonDelete > 0) {
        this.$store.commit("setPosition", elem);
      }
    }
  }
};
</script>

<style scoped>
.title {
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #282136;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #ededed;
}
.panel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.sort {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.sort-title {
  font-weight: 600;
  margin-right: 8px;
  user-select: none;
}
.sort-item {
  margin-right: 13px;
  cursor: pointer;
  user-select: none;
}
.sort-active {
  background-color: #00a11e;
  border-radius: 2px;
  color: white;
  padding: 3px 5px;
}
.buttons {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.button-delete {
  opacity: 0.4;
  padding: 2px 7px;
  border: 1px solid #c6cbd4;
  border-radius: 2px;
  margin-right: 12px;
  user-select: none;
}
.button-delete.active {
  background: #00a11e;
  color: #ffffff;
  cursor: pointer;
  opacity: 1;
}
.page {
  position: relative;
  display: inline-block;
  margin-right: 16px;
}
.page:hover .content {
  display: block;
}
.page .content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 100px;
  overflow-y: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 15px 0px;
}
.page .container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
}
.page .container:hover {
  background-color: #f3f0f0;
}
.page .active {
  font-weight: bold;
}
.show_count-items {
  display: flex;
  align-items: center;
  user-select: none;
}
.arrow-left,
.arrow-right {
  border: 1px solid #c6cbd4;
  border-radius: 2px;
  width: 28px;
  height: 28px;
  opacity: 0.4;
}
.arrow-left.active,
.arrow-right.active {
  opacity: 1;
  cursor: pointer;
}
.arrow-left {
  background: transparent url(../assets/Left.png) 50% center no-repeat;
  margin-right: 8px;
}
.text {
  margin-right: 8px;
}
.arrow-right {
  background: transparent url(../assets/Right.png) 50% center no-repeat;
  margin-right: 16px;
}
.dropdown__show-colunms {
  position: relative;
  display: inline-block;
}
.dropdown__show-colunms:hover .dropdown-content {
  display: block;
}
.dropdown-button {
  border: 1px solid #c6cbd4;
  border-radius: 2px;
  background: transparent url(../assets/Down.png) 98% center no-repeat;
  padding-right: 25px;
  padding: 2px 25px 2px 7px;
  cursor: pointer;
  user-select: none;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 207px;
  height: 243px;
  overflow-y: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 15px 0px;
}
.dropdown-content span:hover {
  background-color: #f1f1f1;
}
.container {
  user-select: none;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}
.container.all-select {
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
  height: 14px;
  width: 14px;
  margin: 10px;
  border-radius: 2px;
  border: 1px solid #c6cbd4;
}
.container input:checked ~ .checkmark {
  background-color: #00a11e;
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