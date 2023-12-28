<template>
  <div class="chat-wrap">
    <div class="wrap-time" v-if="time">{{ time }}</div>
    <div
      class="chat-message-video"
      :class="{ 'chat-self': chatMessage.fromService }"
    >
      <img class="char-avatar" :src="avatar" />
      <div class="video-box" @click="centerDialogVisible = true">
        <el-image :src="chatMessage.content.cover" lazy fit="cover"></el-image>
        <img class="video-play" src="../../assets/default/play.png" />
      </div>
      <el-dialog
        :visible.sync="centerDialogVisible"
        :fullscreen="stateTrue"
        :append-to-body="stateTrue"
        :destroy-on-close="stateTrue"
      >
        <div class="video-proview">
          <video
            class="video-wrap"
            :src="chatMessage.content.src"
            :poster="chatMessage.content.cover"
            object-fit="contain"
            controls="true"
          ></video>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ViewMixin } from "../../components/viewMinix.js";
export default {
  mixins: [ViewMixin],
  data() {
    return {
      centerDialogVisible: false,
      stateTrue: true,
    };
  },
  methods: {
    onPreviewVideo() {
      console.log("onPreviewVideo:", this.chatMessage);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>
<style lang="less" scoped>
.video-proview {
  position: relative;
  .video-wrap {
    // height: 500px;
    height: calc(100vh - 100px);
    position: absolute;
    // top: 50%;
    left: 50%;
    transform: translate(-50%);
  }
}
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
  .chat-message-video {
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
    .video-box {
      position: relative;
      .el-image {
        margin-left: 10px;
        // padding: 10px;
        // background: white;
        border-radius: 6px;

        min-width: 100px;
        min-height: 100px;
        max-width: 150px;
        max-height: 300px;
        // height: 250px;
        object-fit: contain;
      }
      .video-play {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .chat-self {
    flex-direction: row-reverse;

    .char-avatar {
      margin-right: 15px;
    }
  }
}
</style>
  
