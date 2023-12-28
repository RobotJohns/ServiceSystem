export default {
  namespaced: true,
  state: {
    //当前会话ID
    chatConversationID: '',
    //会话列表，存放正在聊天别表
    chatContentArray: []
  },
  getters: {
    chatContentArray: state => state.chatContentArray,
    chatConversationID: state => state.chatConversationID
  },
  actions: {
    /**
     * 用户客服 关闭/隐藏 指会话，需要移除当前现实的 Tab
     * @param {*} state 
     * @param {*} userID 
     */
    removeChatContentByUserID(context, conversations) {
      // console.log('removeChatContentByUserID userID', conversations)
      // console.log('chatConversationID:', context.getters.chatConversationID)
      let index = conversations.findIndex(ele => ele.userID == context.getters.chatConversationID);
      if (index == -1) {
        context.commit('removeChatContent', {
          userID: context.getters.chatConversationID
        })
      }
    },
  },
  mutations: {
    resetConversation(state) {
      state.chatConversationID = '';
      state.chatContentArray = [];
    },

    updateConversation(state, gameID) {
      state.chatConversationID = gameID
    },
    //添加进一个聊天会话
    pustChatContent(state, value) {
      let index = state.chatContentArray.findIndex(ele => ele.userID == value.userID);
      if (index == -1) {
        state.chatContentArray.push(value);
        state.chatConversationID = value.userID
      } else {
        state.chatConversationID = value.userID
      }
    },
    //移除一个会话
    removeChatContent(state, value) {
      let index = state.chatContentArray.findIndex(ele => ele.userID == value.userID);
      // console.log("removeChatContent:", index)
      if (index > -1) {
        state.chatContentArray.splice(index, 1);
        //移除的是当前现实的,需要设置一个激活的
        if (state.chatConversationID == value.userID) {
          let nextTab = state.chatContentArray[index + 1] || state.chatContentArray[index - 1];
          if (nextTab) {
            state.chatConversationID = nextTab.userID
          }
        }
      } else {
        console.warn('removeChatContent faill not find:', value.userID)
      }
    },
    //移除一个会话
    removeChatContentByGameID(state, gameID) {
      let index = state.chatContentArray.findIndex(ele => ele.userID == gameID);
      // console.log("removeChatContentByGameID:", gameID)
      // console.log("removeChatContentByGameID index:", index)
      if (index > -1) {
        state.chatContentArray.splice(index, 1);
        //移除的是当前现实的,需要设置一个激活的
        if (state.chatConversationID == gameID) {
          let nextTab = state.chatContentArray[index - 1] || state.chatContentArray[index] || state.chatContentArray[index + 1];
          if (nextTab) {
            state.chatConversationID = nextTab.userID
          }
        }
      } else {
        console.warn('removeChatContentByGameID faill not find:', gameID)
      }
    }
  },
}
