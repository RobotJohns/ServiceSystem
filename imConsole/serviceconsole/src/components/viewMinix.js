import {
  mapState,
  mapGetters
} from "vuex";
export const ViewMixin = {
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
    chatMessage: {
      type: Object,
      required: true,
      default: () => {
        return {
          msgType: 0,
          content: "",
          time: 0,
          fromService: false,
        };
      },
    },
    index: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "core/userInfo",
      chatMessageArray: "message/chatMessageArray",
    }),
    avatar() {
      if (this.chatMessage.fromService) {
        return this.userInfo.avatar;
      } else {
        return this.chatUserInfo.avatar;
      }
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
    time() {
      ///因为用户端展示机器人和提示消息 服务端没有战士，这里过滤掉 第一条要不然会有索引问题，
      ///当然也可以直接把消息数组处理下，这里采取上面的方式
      if (this.index <= 1) {
        return this.$moment(this.chatMessage.time).format('LLL');
      } else {
        //console.warn('this.chatMessageArray:', this.chatMessageArray)
        const timeBefore = this.chatRecord[this.index - 1].time;
        ///五分钟以内不展示时间
        if (this.chatMessage.time - timeBefore < 5 * 60 * 1000) {
          return '';
        }
        ///1个小时以内展示时间
        if (this.chatMessage.time - this.$moment().valueOf() < 60 * 60 * 1000) {
          return this.$moment(this.chatMessage.time).format('LT');
        }
        return this.$moment(this.chatMessage.time).format('LTS');
      }
    },
    timeNow() {
      return this.$moment(this.chatMessage.time).format('LLL');
    }
  },


}
