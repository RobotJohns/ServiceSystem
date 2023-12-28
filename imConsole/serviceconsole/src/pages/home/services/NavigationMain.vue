<template>
  <div class="navigation-main">
    <el-main>
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        closable
        @edit="handleTabsEdit"
        @tab-click="onTabClick"
      >
        <el-tab-pane
          :key="item.userID"
          v-for="item in chatContentArray"
          :label="item.nickName"
          :name="item.userID"
        >
          <chat-content :chatConversation="item"></chat-content>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>
  
<script>
import chatContent from "../chatConversation/ChatContent.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import socketIoHelper from "../../../utils/socketIoHelper";
import { EventEmit, MessageType } from "../../../utils/constEventSocket";
export default {
  components: {
    chatContent,
  },
  data() {
    return {
      editableTabsValue: "",
    };
  },
  computed: {
    ...mapGetters({
      chatContentArray: "views/chatContentArray",
      chatConversationID: "views/chatConversationID",
    }),
  },
  watch: {
    chatConversationID: {
      handler: function (newVal, oldVal) {
        //console.log("chatConversationID watch:", newVal);
        this.editableTabsValue = newVal;
      },
      immediate: false,
      // deep: true,
    },
  },
  created() {
    this.editableTabsValue = this.chatConversationID;
  },
  mounted() {
    // this.$eventBus.$on(EventView.VIEW_ON_LINE_USER, this.onUserOnline);
    // this.$eventBus.$on(EventView.VIEW_OFF_LINE_USER, this.onUserOffline);
  },
  methods: {
    onTabClick(target) {
      //console.log("打开的是那个：", target.name);
      this.updateConversation(target.name);
      socketIoHelper.emit(EventEmit.chatServiceRead, target.name);
    },
    handleTabsEdit(targetName, action) {
      if (action === "remove") {
        //console.log("关闭的是那个：", targetName);
        this.removeChatContentByGameID(targetName);
        socketIoHelper.emit(EventEmit.chatServiceRead, targetName);
      }
    },
    ...mapMutations({
      updateConversation: "views/updateConversation",
      removeChatContentByGameID: "views/removeChatContentByGameID",
    }),
  },
  destroyed() {
    // this.$eventBus.$off(EventView.VIEW_ON_LINE_USER, item);
    // this.$eventBus.$off(EventView.VIEW_OFF_LINE_USER, item);
  },
};
</script>
  
<style lang="less"  scoped>
.navigation-main {
  width: 100%;
  height: 100%;
  border-left: 1px #ddd solid;
}
.el-main {
  width: 100%;
  height: 100%;
  padding: 0;
}

.el-tabs {
  max-width: calc(100vw - 305px);
  height: 100%;
}
</style>
  