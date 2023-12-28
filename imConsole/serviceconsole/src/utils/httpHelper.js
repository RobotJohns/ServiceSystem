import axios from 'axios';
import config from './config'
import store from '../store/index'
import {
  Message
} from "element-ui";
export default {
  async postRequest(url, datum, showLoading = false, showError = true) {
    return new Promise((resolve) => {
      this.onRequest(url, datum, {
        "content-type": "application/json;charset=utf-8",
      }).then((res) => {
        if (res.status == 200) {
          resolve({
            success: res.data.success,
            message: res.data.message,
            code: res.data.code,
            content: res.data.content,
          })
          if (!res.data.success && showError) {
            Message.error(`访问出错了:${res.data.message}; code:${res.data.code}`)
          }
        } else {
          if (showError) {
            Message.error(`访问出错了:${res.data.message}; code:${res.data.code}`)
          }
        }
      }).catch((error) => {
        resolve({
          success: false,
          message: error.message,
          code: error.code,
          content: null,
        })
        if (showError) {
          Message.error(`访问出错了:${error.message}; code:${error.code}`)
        }
      });
    });
  },

  async postRequestAuth(url, datum = {}, showLoading = false, showError = true) {
    return new Promise((resolve) => {
      this.onRequest(url, Object.assign({
          account: store.state.core.userInfo ? store.state.core.userInfo.account : ''
        }, datum), {
          "content-type": "application/json;charset=utf-8",
          "authorization": "Bearer " + store.state.core.token,
        },
        showLoading,
        showError
      ).then(async (res) => {
        if (res.status == 200) {
          resolve({
            success: res.data.success,
            message: res.data.message,
            code: res.data.code,
            content: res.data.content,
          })
          if (!res.data.success) {
            if (res.data.code == 401) {
              //重定向到登录页面
              await store.dispatch('core/cleanStorage');
            }
            if (showError) {
              Message.error(`访问出错了:${res.data.message}; code:${res.data.code}`)
            }
          }
        } else {
          if (showError) {
            Message.error(`访问出错了:${res.data.message}; code:${res.data.code}`)
          }
          if (res.status == 401) {
            //重定向到登录页面
            await store.dispatch('core/cleanStorage');
          }
        }
      }).catch((error) => {
        resolve({
          success: false,
          message: error.message,
          code: error.code,
          content: null,
        })
        if (showError) {
          Message.error(`访问出错了:${error.message}; code:${error.code}`)
        }
      });
    });
  },

  onRequest(url, datum, headers) {
    return new Promise((resolve, reject) => {
      axios.post(
        `${config.hostHttp}/${url}`,
        datum, {
          headers: headers
        },
      ).then((res) => {
        resolve(res);
      }).catch((error) => {
        reject(error);
      }).finally(() => {

      })
    });
  }
}
