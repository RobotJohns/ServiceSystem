import {
  io
} from 'socket.io-client'
let socket = null;
import config from '../utils/config'
import store from '../store/index'
import {
  playNoticeAudioAuido
} from './utilsTools'
import {
  EventOn
} from './constEventSocket'
export default {
  doConnet() {
    if (socket != null && socket.isConnected) {
      console.error('current socket is connecting, pleace disconnect first!');
      return
    }

    socket = io(config.hostSocket, {
      transports: ['websocket'],
      auth: {
        "identification": 'service',
        "account": store.state.core.userInfo.account,
        "authorization": "Bearer " + store.state.core.token,
      },
    });

    socket.on('connect', () => {
      console.log('connect')
    });
    socket.on('disconnect', () => {
      console.log('disconnect')
    });
    socket.on('error', () => {
      console.log('error')
    });
    socket.on('connect_error', () => {
      console.log('connect_error')
    });
    socket.on('reconnecting', () => {
      console.log('reconnecting')
    });
    socket.on('reconnect', () => {
      console.log('reconnect')
    });
    socket.on('connect_timeout', () => {
      console.log('connect_timeout')
    });

    this.regesterEvent();
  },
  async emit(key, value) {
    if (socket != null && socket.connected) {
      await socket.emit(key, value);
    }
  },
  doDisConnect() {
    socket.disconnect()
  },
  regesterEvent() {
    socket.on(EventOn.chatService, () => {
      console.log('chatMessaget')
    });
    ///更新所有回话
    socket.on(EventOn.serviceConversations, (data) => {
      //store.commit("message/updateConversation", data);
      store.dispatch("message/updateConversation", data)
    });
    ///更新单个回话
    socket.on(EventOn.serviceConversationsOne, (data) => {
      store.dispatch("message/updateConversationOne", data)
      //store.commit("message/updateConversationOne", data);
    });

    socket.on(EventOn.messageToServiceHistory, (data) => {
      store.commit("message/updateChatMessageArray", data);
    })


    /// 来自服务器的的消息
    socket.on(EventOn.messageToService, (data) => {
      store.commit("message/updateChatMessageArray", data);
      //用户发来的消息 才提示音效
      if (data.messages.some(ele => !ele.fromService)) {
        playNoticeAudioAuido();
      }
    });
  }
}
