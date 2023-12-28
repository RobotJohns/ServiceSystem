<template>
  <div class="conversation-tools"></div>
</template>
<script>
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
        };
      },
    },
  },
};
</script>
<style lang="less" scoped>
.conversation-tools {
  background-color: #f5f5f5;
  border-top: 1px #dddddd solid;
  border-bottom: 1px #dddddd solid;
}
</style>
