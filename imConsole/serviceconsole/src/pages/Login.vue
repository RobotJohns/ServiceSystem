<template >
  <div class="login">
    <div class="input-box">
      <div class="block">
        <img src="../assets/default/Icon.png" alt="" />
      </div>
      <el-input
        v-model="inputName"
        maxlength="11"
        clearable
        placeholder="请输入账户"
      ></el-input>
      <div style="height: 20px"></div>
      <el-input
        v-model="inputPw"
        maxlength="11"
        clearable
        show-password
        placeholder="请输入密码"
      ></el-input>
      <el-button plain @click="onLogin">登录</el-button>
    </div>
  </div>
</template>

<script>
import { Md5 } from "../utils/utilsTools";
export default {
  data() {
    return {
      inputName: "",
      inputPw: "",
    };
  },
  methods: {
    async onLogin() {
      let res = await this.$httpHelper.postRequest("account/login", {
        account: this.inputName,
        password: Md5(this.inputPw),
      });
      //console.log("onLoginres  :", res);
      if (res.success) {
        this.$stroe.commit("core/saveToken", res.content);

        let resAccount = await this.$httpHelper.postRequestAuth(
          "account/accountInfo",
          {
            account: this.inputName,
          }
        );
        if (resAccount.success) {
          this.$stroe.commit("views/resetConversation");
          this.$stroe.commit("message/resetConversation");
          this.$stroe.commit("core/saveUserinfo", {
            account: resAccount.content.account,
            nickName: resAccount.content.nickName,
            token: res.content,
            avatar: resAccount.content.avatar,
            state: resAccount.content.state,
            type: resAccount.content.type,
          });
          this.$router.push({ path: "/home" });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 1, 16);
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;

  .input-box {
    padding: 40px;
    width: 450px;
    height: 320px;
    background: #f5f7fa;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .block {
      margin-bottom: 10px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }

    .el-button {
      margin-top: 30px;
    }
  }
}
</style>