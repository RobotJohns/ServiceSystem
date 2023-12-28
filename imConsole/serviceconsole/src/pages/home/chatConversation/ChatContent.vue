<template>
  <div class="chat-Content">
    <chat-content-top
      :chatUserInfo="conversation"
      class="chat-top"
    ></chat-content-top>
    <chat-content-conversation
      id="contentConversation"
      :chatUserInfo="conversation"
      class="chat-conversation"
    ></chat-content-conversation>
    <chat-content-tools
      :chatUserInfo="conversation"
      class="chat-tools"
    ></chat-content-tools>
    <chat-content-bottom
      :chatUserInfo="conversation"
      class="chat-bottom"
    ></chat-content-bottom>
  </div>
</template>

<script>
import ChatContentTop from "./ChatContentTop.vue";
import ChatContentConversation from "./ChatContentConversation.vue";
import ChatContentTools from "./ChatContentTools.vue";
import ChatContentBottom from "./ChatContentBottom.vue";
import socketIoHelper from "../../../utils/socketIoHelper";
import { mapGetters } from "vuex";
import { EventEmit, MessageType } from "../../../utils/constEventSocket";
export default {
  data() {
    return {};
  },
  components: {
    ChatContentTop,
    ChatContentConversation,
    ChatContentTools,
    // ChatContentInput,
    ChatContentBottom,
  },
  computed: {
    ...mapGetters({
      serviceConversations: "message/serviceConversations",
    }),
    conversation() {
      const conversation = this.serviceConversations.find(
        (e) => e.userID == this.chatConversation.userID
      );
      if (conversation) {
        return conversation;
      } else {
        console.warn("会话失效");
        return this.chatUserInfo;
      }
    },
  },
  props: {
    chatConversation: {
      type: Object,
      required: true,
      default: () => {
        return {
          userID: "",
          nickName: "",
          avatar: "",
          unReadCount: 0,
        };
      },
    },
  },
  mounted() {
    console.log("ChatContent     mounted");
    socketIoHelper.emit(
      EventEmit.chatServiceHistory,
      this.chatConversation.userID
    );
    socketIoHelper.emit(
      EventEmit.chatServiceRead,
      this.chatConversation.userID
    );
  },
  destroyed() {
    this.$store.commit(
      "message/resetConversationById",
      this.chatConversation.userID
    );
  },
};
</script>

<style lang="less"  scoped>
.chat-Content {
  max-width: calc(100vw - 305px);
  height: calc(100vh - 110px);
  background-color: white;
  display: flex;
  flex-direction: column;

  .chat-top {
    flex: 1;
    //background: red;
  }
  .chat-conversation {
    flex: 10;
    flex-shrink: 0;
    overflow: auto;
    //background: rgb(126, 114, 114);
  }
  .chat-tools {
    flex: 0.2;
    flex-shrink: 0;
    //background: rgb(250, 64, 105);
  }
  .chat-bottom {
    flex: 2;
    flex-shrink: 0;
    //background: rgb(69, 108, 214);
  }
}
</style>
