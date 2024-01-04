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

        //距离上一条小时的时间
        const timeBefore = this.chatRecord[this.index - 1].time;
        ///和上一条消息相差  五分钟以内不展示时间
        if (this.chatMessage.time - timeBefore < 5 * 60 * 1000) {
          return '';
        }
        //一个小时的毫秒数
        const hourMillisecond = 60 * 60 * 1000;
        //当前时间减去 消息时间差
        const timeSpan = this.$moment().valueOf() - this.chatMessage.time
        //1个小时以内展示时间
        if (timeSpan < hourMillisecond) {
          return `${this.$moment(this.chatMessage.time).format('LT')}`
        }
        const todayTime = this.$moment().startOf('day').format('x')
        ///当天消息今天0点的之后
        if (todayTime < this.chatMessage.time) {
          return `${this.$moment(this.chatMessage.time).format('ah:m')}`
          ///今天0点以前
        } else {
          return `${this.$moment(this.chatMessage.time).format('M月D日 ah:m')} `;
        }
      }
    },
    timeNow() {
      return this.$moment(this.chatMessage.time).format('LLL');
    }
  },


}
