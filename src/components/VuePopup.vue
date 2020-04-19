<template>
  <div class="main" @click.self="cancelDelete()" v-if="this.$store.state.popup.show">
    <div class="popup" :style="styleObject">
      <div class="text" v-html="getText"></div>
      <div class="buttons" v-if="getStatusServer != 'connect'">
        <div class="cancel" @click="cancelDelete()">Cancel</div>
        <div class="confirm" v-if="getStatusServer == 'allow'" @click="goDelete()">Confirm</div>
        <div class="again" v-else-if="getStatusServer == 'error'" @click="goDelete()">Again</div>
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
    window.addEventListener("resize", this.updateWidth);
  },
  computed: {
    styleObject: function() {
      return {
        top: this.$store.state.popup.X + "px",
        left: this.$store.state.popup.Y + "px"
      };
    },
    getStatusServer: function() {
      return this.$store.state.server.delete;
    },
    getText: function() {
      let text = "";
      switch (
        this.getStatusServer // 'connect', 'error', 'allow'
      ) {
        case "connect":
          text = "<b>Delete item</b> ...";
          break;
        case "allow":
          text = "Are you sure you want to <b>delete item</b>?";
          break;
        case "error":
          text =
            "<b>Error</b>. Repeat again (" +
            this.$store.state.server.errorDel +
            ")?";
          break;
      }
      return text;
    }
  },
  methods: {
    cancelDelete() {
      let buttonsDelete = document.getElementsByClassName("show-delete");
      for (let i = 0; i < buttonsDelete.length; i++) {
        buttonsDelete[i].classList.remove("show-delete");
      }
      this.$store.state.popup.show = false;
      this.$store.state.server.delete = "allow";
    },
    goDelete() {
      this.$store.state.server.delete = "connect";
      this.$store.dispatch("deleteSelectRows");
    },
    updateWidth() {
      this.$store.state.popup.show = false;
    }
  }
};
</script>

<style scoped>
.main {
  z-index: 2;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.popup {
  position: absolute;
  background-color: #ffffff;
  color: #282136;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
  width: 218px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
}
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.buttons div {
  border: 1px solid #c5ccd4;
  border-radius: 4px;
  padding: 3px 16px;
  cursor: pointer;
}
.cancel {
  color: #5b5e77;
  margin-right: 16px;
}
.confirm {
  background-color: #00a11f;
  color: white;
}
.again {
  background-color: #e55b5b;
  color: white;
}
</style>