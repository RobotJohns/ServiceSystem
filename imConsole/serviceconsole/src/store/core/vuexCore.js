const localStorageKey = 'Storage_User_Account'
const localStorageTokenKey = 'Storage_User_Token'
import router from '../../router/router'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {
      account: 18768424958,
      nickName: '王大锤',
      avatar: "https://user-info-1302720239.cos.ap-nanjing.myqcloud.com/userIcon/user_icon_000111.jpg?imageView2/1/w/80/h/80/q/66",
      state: 0,
      type: 0,
    }
  },
  getters: {
    userInfo: state => state.userInfo,
    token: state => state.token
  },
  mutations: {
    saveToken(state, value) {
      state.token = value;
      localStorage.setItem(localStorageTokenKey, value);
    },
    updateToken(state, value) {
      state.token = value;
    },
    saveUserinfo(state, value) {
      state.userInfo = value;
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    },
    updateUserInfo(state, value) {
      state.userInfo = value;
    }
  },
  actions: {
    async loadStorage(context, provider) {
      let res = localStorage.getItem(localStorageKey);
      if (res) {
        context.commit('updateUserInfo', JSON.parse(res))
      } else {
        context.commit('updateUserInfo', null)
      }

      let resToken = localStorage.getItem(localStorageTokenKey);
      if (resToken) {
        context.commit('updateToken', resToken)
      } else {
        context.commit('updateToken', null)
      }
    },
    async cleanStorage(context, provider) {
      localStorage.removeItem(localStorageKey);
      context.commit('updateUserInfo', null)

      localStorage.removeItem(localStorageTokenKey);
      context.commit('updateToken', null)

      router.push({
        path: "/"
      });
    },
  }
}
