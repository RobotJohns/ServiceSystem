<template>
  <div class="navigation-header">
    <el-container>
      <el-header>
        <div class="header-info">
          <el-row type="flex" justify="space-between" align="middle">
            <div class="left">
              <i class="el-icon-s-promotion"></i>
              <span>品瑞客服 version:1.0.0</span>
            </div>
            <div class="right">
              <el-avatar
                class="header-info-ele"
                :size="40"
                :src="userInfo.avatar"
              ></el-avatar>
              <span class="header-info-ele">{{ userInfo.nickName }}</span>
              <el-button
                type="primary"
                plain
                class="header-info-ele"
                @click="onLoginOut"
                >退出登录</el-button
              >
            </div>
          </el-row>
        </div>
      </el-header>
    </el-container>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "core/userInfo",
    }),
  },
  methods: {
    onLoginOut() {
      console.log("退出登录");
      this.$stroe.dispatch("core/cleanStorage");
      // this.$router.push({ path: "/" });
    },
  },
};
</script>
  
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.navigation-header {
  .el-header {
    background-color: #ebeef5;
    height: 100%;
    .header-info {
      .right {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .header-info-ele {
        margin: 0 5px;
      }

      height: 100%;
      .el-row {
        height: 100%;
      }
    }
  }
}
</style>
  