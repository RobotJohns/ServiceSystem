<template>
  <div class="conversation-top">
    <div class="top-left">
      <img :src="chatUserInfo.avatar" alt="" />
      <span>ID:{{ chatUserInfo.userID }}</span>
      <span>昵称：{{ chatUserInfo.nickName }}</span>
    </div>
    <div class="top-left">
      <el-button
        v-if="!chatUserInfo.onLine"
        type="warning"
        round
        @click="onHide()"
        >隐藏会话</el-button
      >
      <el-button
        v-if="!chatUserInfo.onLine"
        type="danger"
        plain
        @click="onClose()"
        >结束会话</el-button
      >
    </div>
  </div>
</template>
<script>
import httpHelper from "../../../utils/httpHelper";
export default {
  data() {
    return {};
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
          onLine: true,
        };
      },
    },
  },
  methods: {
    onHide() {
      this.$confirm("此操作将隐藏该会话，当用户继续提问是将再次展示", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(this.onConfirmHide)
        .catch(() => {});
    },

    onClose() {
      this.$confirm("此操作将标记当前问题已经解决？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(this.onConfirmClose)
        .catch(() => {});
    },
    async onConfirmHide() {
      const res = await httpHelper.postRequestAuth("api/hideConversation", {
        conversationID: this.chatUserInfo.userID,
      });
      if (res.success) {
        this.$message({
          type: "success",
          message: "隐藏成功!",
        });
      }
    },
    async onConfirmClose() {
      const res = await httpHelper.postRequestAuth("api/colseConversation", {
        conversationID: this.chatUserInfo.userID,
      });
      if (res.success) {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.conversation-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 2px #dddddd solid;
  justify-content: space-between;
  .top-left {
    // background: gray;
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      margin-left: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    span {
      text-align: center;
      line-height: 100%;
      margin: 0 10px;
    }
  }
  .top-left {
    margin-right: 20px;
  }
}
</style>
