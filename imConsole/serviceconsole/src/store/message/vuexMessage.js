import {
  EventBus
} from '../../utils/eventBus'
import {
  EventView
} from '../../utils/constEventView'
import Vue from 'vue';
export default {
  namespaced: true,
  state: {
    //客服人员的会话
    serviceConversations: [],
    // //用户聊天数据,根据会话ID 分类
    chatMessageArray: []

  },
  getters: {
    serviceConversations: state => state.serviceConversations,
    chatMessageArray: state => state.chatMessageArray,
    // gettersView(state, getters, rootState, rootGetters){

    // }
  },
  actions: {
    async updateConversationOne(context, conversation) {
      // console.log('context:', context)
      // console.log('context.getters.serviceConversations:', context.getters.serviceConversations)
      // console.log('context.rootState.views.chatConversationID:', context.rootState.views.chatConversationID)
      const index = context.getters.serviceConversations.findIndex(e => e.userID == conversation.userID);
      if (index > -1) {
        if (context.rootState.views.chatConversationID == conversation.userID) {
          conversation.unReadCount = 0
          //Vue.set(state.serviceConversations, index, conversation)
          context.commit('updateConversationByindex', [index, conversation])
        } else {
          //更新状态
          //Vue.set(state.serviceConversations, index, conversation)
          context.commit('updateConversationByindex', [index, conversation])
        }
      }
    },
    /**
     * 会话更新全部
     * @param {*} state 
     * @param {*} conversations 
     */
    async updateConversation(context, conversations) {
      //state.serviceConversations = conversations
      ///如果有会话不在 会话列表中 说明已经移除了
      ///处理移除操作
      await context.dispatch('views/removeChatContentByUserID', conversations, {
        root: true
      });
      context.commit('updateConversation', conversations)
    },
  },
  mutations: {
    resetConversation(state) {
      state.chatMessageArray = [];
    },
    resetConversationById(state, conversationID) {
      const index = state.chatMessageArray.findIndex((ele) => {
        return ele['conversationID'] == conversationID
      })
      if (index > -1) {
        state.chatMessageArray.splice(index, 1);
      }
    },
    ///会话更新全部
    updateConversation(state, conversations) {
      state.serviceConversations = conversations
    },
    ///会话更新单条
    updateConversationByindex(state, [index, conversation]) {
      // console.log('state:', state)
      // console.log('index:', index)
      // console.log('conversation:', conversation)
      Vue.set(state.serviceConversations, index, conversation)
    },

    /**
     * 来自会话的  消息（自己的+用户的），这里包含 实时消息和历史消息，
     * 客服打开 会话的时候会请求历史消息，在这之前如果 有实时消息 则会出现重复的情况； 
     * 这里需要做 处理
     * @param {*} state 
     * @param {*} messages 
     */
    updateChatMessageArray(state, messages) {
      const conversationID = messages['conversationID'];
      const index = state.chatMessageArray.findIndex((ele) => {
        return ele['conversationID'] == conversationID
      })
      if (index > -1) {
        let messageArray = state.chatMessageArray[index].messageArray.concat(messages['messages'])
        //去重处理，以毫秒时间戳
        // const uniqueArray = messages.filter((obj, index, self) =>
        //   index === self.findIndex((o) =>
        //     o.id === obj.id && o.name === obj.name
        //   )
        // );
        // state.chatMessageArray[index].messageArray = messages
        messageArray = messageArray.filter((obj, index, self) =>
          index === self.findIndex((o) =>
            // o.id === obj.id && o.name === obj.name
            o.time == obj.time
          )
        );
        messageArray.sort((a, b) => a.time - b.time);
        state.chatMessageArray[index].messageArray = messageArray

      } else {
        state.chatMessageArray.push({
          conversationID: conversationID,
          messageArray: messages['messages']
        })
      }
      //通知页面滚动到底部了
      EventBus.$emit(EventView.newMessage, conversationID);
    },
  },
}
