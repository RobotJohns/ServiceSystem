<template>
  <div class="navigation-owner">
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1"
          class="el-menu-vertical"
          @select="onSelectMenu"
        >
          <el-menu-item index="1" style="display: flex; align-items: center">
            <i class="el-icon-s-home"></i>
            <span slot="title"> 数据统计 </span>
          </el-menu-item>

          <el-menu-item index="2" style="display: flex; align-items: center">
            <i class="el-icon-s-tools"></i>
            <span slot="title"> 客服管理 </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <service-preview v-if="index == 1"></service-preview>
        <owner-settings v-else-if="index == 2"></owner-settings>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ServicePreview from "../ServicesPreviews.vue";
import OwnerSettings from "./OwnerSetting.vue";
export default {
  data() {
    return {
      index: 1,
    };
  },
  components: {
    OwnerSettings,
    ServicePreview,
  },
  methods: {
    onSelectMenu(index) {
      this.index = index;
      console.log("onSelectMenu:", index);
    },
  },
};
</script>

<style lang="less" scoped>
.navigation-owner {
  width: 100%;
  height: 100%;
  .el-aside {
    background-color: #ebeef5;
    //background-color: rgb(165, 163, 163);
    color: #333;
    text-align: center;
    line-height: 200px;
    height: 100%;
  }
  .el-main {
    width: 100%;
    height: 100%;
    padding: 0;
  }
  .el-container {
    height: 100%;
  }
  .navigation-owner {
    height: 100%;
  }
}
</style>