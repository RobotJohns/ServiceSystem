<template>
  <div class="Chat-Conversation">
    <el-scrollbar ref="scrollContent" class="infinite-list-wrapper">
      <!-- {{ chatRecord }} -->
      <div
        v-for="(item, index) in chatRecord"
        track-by="$index"
        class="infinite-list-item"
        :key="index"
      >
        <Message-Char
          :chatMessage="item"
          :index="index"
          :chatUserInfo="chatUserInfo"
          v-if="item.msgType == messageCharacters"
        ></Message-Char>
        <Message-Image
          :chatMessage="item"
          :index="index"
          :chatUserInfo="chatUserInfo"
          v-else-if="item.msgType == messagePicture"
        ></Message-Image>
        <Message-Video
          :chatMessage="item"
          :index="index"
          :chatUserInfo="chatUserInfo"
          v-else-if="item.msgType == messageVideo"
        ></Message-Video>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import MessageChar from "@/components/chatContent/chatMessageChar.vue";
import MessageImage from "@/components/chatContent/chatMessageImage.vue";
import MessageVideo from "@/components/chatContent/chatMessageVideo.vue";
import { MessageType } from "../../../utils/constEventSocket";
import { EventView } from "../../../utils/constEventView";
import { awaitMillisecond } from "../../../utils/utilsTools";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  components: {
    MessageChar,
    MessageImage,
    MessageVideo,
  },
  data() {
    return {
      loading: false, //加载时的动画
      pageSize: 20,
      pageIndex: 1,
    };
  },
  props: {
    chatUserInfo: {
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
  computed: {
    ...mapGetters({
      chatMessageArray: "message/chatMessageArray",
    }),
    messageNoticem() {
      return MessageType.noticeSystem;
    },
    messageRobot() {
      return MessageType.charactersRobot;
    },
    messageCharacters() {
      return MessageType.characters;
    },
    messagePicture() {
      return MessageType.picture;
    },
    messageVideo() {
      return MessageType.video;
    },
    chatRecord() {
      const res = this.chatMessageArray.find((ele) => {
        return ele["conversationID"] == this.chatUserInfo.userID;
      });
      if (res) {
        return res.messageArray;
      } else {
        return [];
      }
    },
  },
  beforeMount() {},
  mounted() {
    this.$EventBus.$on(EventView.newMessage, (id) => {
      if (id == this.chatUserInfo.userID) {
        this.onScrollToBottom();
      }
    });
    console.log("mounted");
    this.handleScroll();
  },

  methods: {
    handleScroll() {
      // console.log(this.$refs.scrollContent);
      // console.log(this.$refs.scrollContent.wrap);
      // console.log(this.$refs.scrollContent.wrap.scrollHeight);滚动区域
      // console.log(this.$refs.scrollContent.wrap.scrollTop);//滚动的位置上
      let scrollbarEl = this.$refs.scrollContent.wrap;
      scrollbarEl.onscroll = () => {
        if (scrollbarEl.scrollTop == 0) {
          console.log(this.chatUserInfo.userID, "滚动到顶部了");
        }
      };
    },
    async onScrollToBottom() {
      await awaitMillisecond(1000);
      this.$refs.scrollContent.wrap.scrollTop =
        this.$refs.scrollContent.wrap.scrollHeight + 20;
    },
  },
  destroyed() {
    this.$EventBus.$off(EventView.newMessage);
  },
};
</script>
<style lang="less" scoped>
.Chat-Conversation {
  background-color: #ebeef5;
  .infinite-list-wrapper {
    height: 100%;
    // height: 200px;
    // display: flex;
    // flex:1;
    // flex-direction: column;

    .infinite-list-item {
      // display: inline-block;
      margin-bottom: 8px;
      // background-color: white;
    }
    .infinite-list-item:last-child{
      margin-bottom: 30px;
    }
  }
}
</style>
