<template>
  <div class="home">
    <navigaton-header></navigaton-header>
    <el-container v-if="userInfo.type != 9">
      <navigation-service></navigation-service>
    </el-container>
    <el-container v-else>
      <navigation-owner></navigation-owner>
    </el-container>
  </div>
</template>
<script>
import NavigationOwner from "./owner/NavigationOwner.vue";
import NavigationService from "./services/NavigationService.vue";
import NavigatonHeader from "./NavigationHeader.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    NavigatonHeader,
    NavigationService,
    NavigationOwner,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userInfo: "core/userInfo",
    }),
  },

  methods: {},
};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>