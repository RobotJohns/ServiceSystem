<template>
  <div class="chat-wrap">
    <div class="wrap-time" v-if="time">{{ time }}</div>
    <div
      class="chat-message-image"
      :class="{ 'chat-self': chatMessage.fromService }"
    >
      <img class="char-avatar" :src="avatar" />
      <el-image
        :src="chatMessage.content"
        lazy
        fit="cover"
        :preview-src-list="[chatMessage.content]"
      ></el-image>
    </div>
  </div>
</template>
<script>
import { ViewMixin } from "../../components/viewMinix.js";
export default {
  mixins: [ViewMixin],
};
</script>
</script>
<style lang="less" scoped>
.chat-wrap {
  margin: 00px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .wrap-time {
    font-size: 16px;
    color: #333;
    //  margin-top: 20rpx;
    // margin-bottom: 20rpx;
    margin: 20px 0;
  }
  .chat-message-image {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    .char-avatar {
      margin-left: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .el-image {
      margin-left: 10px;
      // padding: 10px;
      // background: white;
      border-radius: 6px;
      min-width: 50px;
      min-height: 50px;
      max-width: 120px;
      max-height: 250px;
      object-fit: contain;
    }
  }
  .chat-self {
    flex-direction: row-reverse;
    //margin-left: 50px;
    .char-avatar {
      margin-right: 15px;
    }
  }
}
</style>
  