<template >
  <div class="owner-settings">
    <div>
      <div class="settings-list">
        <el-table :data="servicesArray" style="width: 100%">
          <el-table-column prop="avatar" label="头像" width="80">
            <template slot-scope="scope">
              <img
                :src="scope.row.avatar"
                alt=""
                style="width: 40px; height: 40px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="account" label="账号" width="180">
          </el-table-column>
          <el-table-column prop="nickName" label="昵称" width="180">
          </el-table-column>
          <el-table-column prop="type" label="账号类型" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">客服</span>
              <span v-else>管理员</span>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="账号状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 1">正常</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="settings-top">
        <el-button type="primary" round @click="drawer = true"
          >添加客服</el-button
        >
      </div>
    </div>
    <el-drawer
      class="drawer-wrap"
      title="添加客服"
      size="300"
      :visible.sync="drawer"
      :direction="direction"
      :append-to-body="appendToBody"
    >
      <div class="input-line">
        <span>账户名称</span>
        <el-input
          v-model="inputName"
          maxlength="11"
          clearable
          placeholder="手机号码"
        ></el-input>
      </div>
      <div class="input-line">
        <span>登录密码</span>
        <el-input
          v-model="inputPw"
          maxlength="11"
          clearable
          placeholder="登录密码"
        ></el-input>
      </div>
      <div class="input-line">
        <span>账户昵称</span>
        <el-input
          v-model="inputNickName"
          maxlength="11"
          clearable
          placeholder="账户昵称"
        ></el-input>
      </div>
      <el-button type="primary" round @click="onAddAccount()">添加</el-button>
    </el-drawer>
    <el-drawer
      class="drawer-wrap drawer-wrap-editer"
      title="编辑"
      :visible.sync="drawerEditer"
      :direction="direction"
      :append-to-body="appendToBody"
    >
      <div class="input-line">
        <span>账户名称</span>
        <el-input
          v-model="editerAccount.accountName"
          maxlength="11"
          clearable
          :disabled="true"
          placeholder="手机号码"
        ></el-input>
      </div>
      <div class="input-line">
        <span>登录密码</span>
        <el-input
          v-model="editerAccount.password"
          maxlength="11"
          clearable
          placeholder="登录密码"
        ></el-input>
      </div>
      <div class="input-line">
        <span>账户昵称</span>
        <el-input
          v-model="editerAccount.nickName"
          maxlength="11"
          clearable
          placeholder="账户昵称"
        ></el-input>
      </div>
      <div class="input-line">
        <span>账户头像</span>
        <el-upload
          class="avatar-uploader"
          :action="actionHost"
          :limit="1"
          :file-list="[]"
          :show-file-list="false"
          :on-success="onavatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="editerAccount.avatar"
            :src="editerAccount.avatar"
            class="avatar"
          />
        </el-upload>
      </div>
      <div class="input-line">
        <span>账户状态</span>
        <el-switch
          v-model="editerAccount.state"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </div>
      <el-button type="primary" round @click="onEditorAccount()"
        >修改</el-button
      >
    </el-drawer>
  </div>
</template>
<script>
import httpHelper from "../../../utils/httpHelper";
import config from "../../../utils/config";
import { Md5 } from "../../../utils/utilsTools";
export default {
  data() {
    return {
      drawer: false,
      drawerEditer: false,
      appendToBody: true,
      direction: "rtl",
      inputName: "",
      inputPw: "",
      inputNickName: "",
      servicesArray: [],
      editerAccount: {
        accountName: "",
        password: "",
        nickName: "",
        avatar: "",
        state: "",
        type: "",
      },
    };
  },
  computed: {
    actionHost() {
      return `${config.hostHttp}/files/upload`;
    },
  },
  mounted() {
    this.onRefresh();
  },
  methods: {
    async onRefresh() {
      const res = await httpHelper.postRequestAuth("account/accountList");
      if (res.success) {
        this.servicesArray = res.content;
      }
    },
    onAddAccount() {
      if (this.inputName && this.inputNickName && this.inputPw) {
        this.$confirm("你确定要添加该账号吗").then((_) => {
          if (_ == "confirm") {
            this.doAddAccount();
          }
        });
      } else {
        this.$alert("请检查你的输入", {
          confirmButtonText: "确定",
        });
      }
    },
    async doAddAccount() {
      const res = await httpHelper.postRequestAuth("account/register", {
        accountName: this.inputName,
        nickName: this.inputNickName,
        password: Md5(this.inputPw),
      });
      if (res.success) {
        this.drawer = false;
        this.onRefresh();
      }
    },
    handleEdit(index, row) {
      this.editerAccount = {
        accountName: this.servicesArray[index]["account"],
        password: "",
        nickName: this.servicesArray[index]["nickName"],
        avatar: this.servicesArray[index]["avatar"],
        state: this.servicesArray[index]["state"] == 1,
        // type: this.servicesArray[index]["type"],
      };
      this.drawerEditer = true;
    },
    onavatarSuccess(data) {
      if (data.success) {
        this.editerAccount.avatar = data.content;
      }
    },
    beforeAvatarUpload(file) {
      // console.log(file);
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
    onEditorAccount() {
      console.log("this.editerAccount:", this.editerAccount);
      this.$confirm("你确定要修改该账号吗").then(async (_) => {
        if (_ == "confirm") {
          let deta = {
            accountName: this.editerAccount.accountName,
            nickName: this.editerAccount.nickName,
            avatar: this.editerAccount.avatar,
            state: this.editerAccount.state,
          };
          if (this.editerAccount.password) {
            deta.password = Md5(this.editerAccount.password);
          }
          const res = await httpHelper.postRequestAuth(
            "account/accountEditor",
            deta
          );
          if (res.success) {
            this.drawerEditer = false;
            this.onRefresh();
            this.$message({
              message: "恭喜你，信息修改成功",
              type: "success",
            });
          }
        }
      });
    },
  },
};
</script>
</script>


<style lang="less" scoped>
.drawer-wrap {
  .input-line {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: 14px;
    align-items: center;

    .el-input {
      width: 50%;
    }
    span {
      margin: 0 30px;
      line-height: 40px;
    }
    .avatar {
      width: 40px;
      height: 40px;
    }

    .avatar-uploader {
    }
  }
  .el-button {
    margin-top: 60px;
    margin-left: 140px;
    width: 160px;
  }
}
.owner-settings {
  width: 100%;
  height: 100%;
  background-color: #d5d5d5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .settings-top {
    padding-top: 15px;
    padding-right: 10px;
    height: 54px;
    /* border-top: 1px #ebeef5 solid;
    border-bottom: 1px #ebeef5 solid; */
    text-align: end;
  }
}
</style>