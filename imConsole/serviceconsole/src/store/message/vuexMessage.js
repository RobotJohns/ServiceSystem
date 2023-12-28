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
     * 来自会话的  消息（自己的+用户的）
     * @param {*} state 
     * @param {*} messages 
     */
    updateChatMessageArray(state, messages) {
      const conversationID = messages['conversationID'];
      const index = state.chatMessageArray.findIndex((ele) => {
        return ele['conversationID'] == conversationID
      })
      if (index > -1) {
        state.chatMessageArray[index].messageArray = state.chatMessageArray[index].messageArray.concat(messages['messages'])
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
