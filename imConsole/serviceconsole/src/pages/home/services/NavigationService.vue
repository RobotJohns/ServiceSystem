<template>
  <div class="navigation-service">
    <el-container>
      <el-aside width="300px">
        <el-menu
          default-active="1"
          class="el-menu-vertical"
          @select="onSelectMenu"
        >
          <el-menu-item index="1" style="display: flex; align-items: center">
            <i class="el-icon-s-home"></i>
            <span slot="title"> 首页统计 </span>
          </el-menu-item>
          <el-submenu index="2">
            <div slot="title" style="display: flex; align-items: center">
              <i class="el-icon-reading"></i>
              <span slot="title">在线用户</span>
            </div>

            <el-menu-item
              :index="'2-' + index"
              v-for="(item, index) in serviceConversationsOnline"
              :key="item.userID"
              @click="onChatOnLine(item)"
            >
              <div class="user-item-online">
                <img :src="item.avatar" alt="" />
                <span>{{ item.nickName }}</span>
                <el-badge
                  class="mark"
                  :value="item.unReadCount"
                  v-if="item.unReadCount > 0"
                />
              </div>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <div slot="title" style="display: flex; align-items: center">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">离线用户</span>
            </div>

            <el-menu-item
              :index="'3-' + index"
              v-for="(item, index) in serviceConversationsOffline"
              :key="item.userID"
              @click="onChatOffLine(item)"
            >
              <div class="user-item-offline">
                <div class="offline">
                  <img :src="item.avatar" alt="" />
                  <span>{{ item.nickName }}</span>
                </div>
                <el-badge
                  class="mark"
                  :value="item.unReadCount"
                  v-if="item.unReadCount > 0"
                />
              </div>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <services-preview
        ref="preview"
        v-show="selectIndex == 1"
      ></services-preview>
      <navigation-main v-show="selectIndex != 1"></navigation-main>
    </el-container>
  </div>
</template>


<script>
import NavigationMain from "./NavigationMain.vue";
import ServicesPreview from "../ServicesPreviews.vue";
import socketIoHelper from "../../../utils/socketIoHelper";
import { mapGetters, mapMutations } from "vuex";
import { EventEmit, MessageType } from "../../../utils/constEventSocket";
export default {
  components: {
    NavigationMain,
    ServicesPreview,
  },
  data() {
    return {
      selectIndex: 1,
    };
  },
  computed: {
    ...mapGetters({
      serviceConversations: "message/serviceConversations",
    }),
    serviceConversationsOnline() {
      return this.serviceConversations.filter((e) => e["onLine"]);
    },
    serviceConversationsOffline() {
      return this.serviceConversations.filter((e) => !e["onLine"]);
    },
  },
  mounted() {
    //console.log('userInfo:',this.userInfo)
    socketIoHelper.doConnet();
  },
  methods: {
    onChatOnLine(item) {
      //console.log("onChatOnLine:", item);

      this.updateConversation(item.userID);
      this.pustChatContent(item);
      this.selectIndex = 2;

      socketIoHelper.emit(EventEmit.chatServiceRead, item.userID);
    },
    onChatOffLine(item) {
      // console.log("onChatOffLine:", item);
      this.updateConversation(item.userID);
      this.pustChatContent(item);
      this.selectIndex = 2;

      socketIoHelper.emit(EventEmit.chatServiceRead, item.userID);
    },
    onSelectMenu(index) {
      if (index == 1) {
        this.selectIndex = index;
        this.$refs.preview.onRefresh();
      }
      //this.selectIndex = index;
      //console.log("onSelectMenu:", index);
    },
    ...mapMutations({
      updateConversation: "views/updateConversation",
      pustChatContent: "views/pustChatContent",
    }),
  },
  destroyed() {
    socketIoHelper.doDisConnect();
    // this.$eventBus.$off(EventView.VIEW_ON_LINE_USER, item);
    // this.$eventBus.$off(EventView.VIEW_OFF_LINE_USER, item);
  },
};
</script>

<style  lang="less" scoped>
.el-container {
  height: 100%;
}
.navigation-service {
  width: 100%;
  height: 100%;
  .el-tabs {
    max-width: calc(100vw - 305px);
    height: 100%;
  }
}

.el-aside {
  background-color: #ebeef5;
  //background-color: rgb(165, 163, 163);
  color: #333;
  text-align: center;
  line-height: 200px;
  height: 100%;
}

.user-item-online {
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: start;
  width: 100%;

  img {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin-right: 3px;
  }
  span {
    display: block;
    padding: 0 5px;
    max-width: 250px;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    // text-overflow: ellipsis;
  }
  .el-badge {
    margin-left: 5px;
    margin-bottom: 3px;
  }
}
.user-item-offline {
  display: flex;
  flex-direction: row;
  align-items: center;
  //justify-content: start;
  width: 100%;

  img {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin-right: 3px;
  }

  span {
    display: block;
    padding: 0 5px;
    max-width: 250px;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    // text-overflow: ellipsis;
  }
  .el-badge {
    margin-left: 5px;
    margin-bottom: 3px;
  }
  .offline {
    display: flex;
    flex-direction: row;
    align-items: center;
    filter: grayscale(100%);
  }
}
</style>