<template>
  <div class="conversation-bottom">
    <textarea v-model="inputText"></textarea>
    <div class="bottom">
      <el-upload
        class="bottom-left"
        :action="actionHost"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-success="onSuccess"
        :on-errorr="onError"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传 .jpg .png .mp4</div>
      </el-upload>

      <div class="bottom-right">
        <el-button type="success" plain @click="onSned()">点击发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import config from "../../../utils/config";
import socketIoHelper from "../../../utils/socketIoHelper";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { EventEmit, MessageType } from "../../../utils/constEventSocket";
export default {
  data() {
    return {
      inputText: "",
      fileInfo: null,
      fileList: [],
    };
  },
  computed: {
    ...mapGetters({
      chatContentArray: "views/chatContentArray",
    }),
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
    actionHost() {
      return `${config.hostHttp}/files/upload`;
    },
  },
  mounted() {},
  methods: {
    handleRemove(file, fileList) {
      //console.log("handleRemove:", file, fileList);
      this.fileInfo = null;
    },
    handlePreview(file) {
      //console.log("handlePreview:", file);
    },
    handleExceed(files, fileList) {
      this.$message.warning("每次上传只能选择一个文件");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {
      //console.log(file);
      const isImage =
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png";
      const isVideo = file.type == "video/mp4";
      const isLt2M = file.size / 1024 / 1024 < 10;
      const isLt20M = file.size / 1024 / 1024 < 10;

      if (isVideo) {
        if (!isLt20M) {
          this.$message.error("视频文件需要小于 10MB!");
        } else {
          return true;
        }
      } else if (isImage) {
        if (!isLt2M) {
          this.$message.error("图片文件需要小于 2MB!");
        } else {
          return true;
        }
      } else {
        this.$message.error("你选择的文件格式不支持");
      }
    },
    onSuccess(res) {
      //console.log("onSuccess", res);
      const suffixArray = [".jpg", ".jpeg", ".png", ".mp4"];
      if (res.success) {
        console.log(res.content);
        const index = res.content.lastIndexOf(".");
        if (index > -1) {
          const suffix = res.content.substr(index);
          const suffixIndex = suffixArray.indexOf(suffix);
          if (suffixIndex > -1) {
            if (suffixIndex > 2) {
              this.fileInfo = {
                conversationID: this.chatUserInfo.userID,
                message: {
                  msgType: MessageType.video,
                  content: res.content,
                },
              };
            } else {
              this.fileInfo = {
                conversationID: this.chatUserInfo.userID,
                message: {
                  msgType: MessageType.picture,
                  content: res.content,
                },
              };
            }
          }
        }
      }
    },

    onError(res) {
      console.log("onError", res);
    },

    async onSned() {
      //console.log("----->");
      if (this.inputText) {
        socketIoHelper.emit(EventEmit.chatService, {
          conversationID: this.chatUserInfo.userID,
          message: {
            msgType: MessageType.characters,
            content: this.inputText,
          },
        });
        this.inputText = "";
      }
      if (this.fileInfo) {
        await socketIoHelper.emit(EventEmit.chatService, this.fileInfo);
        this.fileInfo = null;
        this.fileList = [];
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-icon-picture-outline {
  font-size: 30px;
}

.el-icon-video-play {
  font-size: 30px;
}

.conversation-bottom {
  display: flex;
  flex-direction: column;
  justify-content: start;
  // background: blue;

  textarea {
    padding: 10px;
    height: 100%;
    width: 100%;
    resize: none;
    font-size: 14px;
    flex: 1;
  }

  .bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 5px;
    justify-content: space-between;
    background-color: #f5f5f5;
    border-top: 1px #cccccc solid;
    border-bottom: 1px #cccccc solid;
    flex: 1.3;
  }

  .bottom-left {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;

    .el-upload__tip {
      margin: 0 10px;
    }
  }
  .bottom-right {
    .el-button {
      width: 120px;
    }
  }
}
</style>
