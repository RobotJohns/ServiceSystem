import Vue from "vue"
import Vuex from "vuex"
import {
	EventView,
} from '../utils/constEventSocket.js'
import {
	EventBus
} from '../utils/eventBus'
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userInfo: null,
		serviceInfo: null,
		requesthistory: false,
		chatMessageArray: [],
	},
	getters: {
		userInfo: state => state.userInfo,
		serviceInfo: state => state.serviceInfo,
		chatMessageArray: state => state.chatMessageArray,
	},
	actions: {

	},
	mutations: {
		updateUserInfo(state, value) {
			state.userInfo = value
		},
		updateServiceInfo(state, value) {
			state.serviceInfo = value
		},
		requesthistoryState(state, value) {
			state.requesthistory = value
		},
		clearDatum(state, value) {
			state.userInfo = null;
			state.serviceInfo = null;
			state.requesthistory = false;
			state.chatMessageArray = [];
		},
		updateChatMessageArray(state, value) {
			let messageArray = state.chatMessageArray = state.chatMessageArray.concat(value)
			messageArray = messageArray.filter((obj, index, self) =>
				index === self.findIndex((o) =>
					o.time == obj.time && o.fromService == obj.fromService && o.msgType == obj.msgType
				)
			);
			messageArray.sort((a, b) => a.time - b.time);
			state.chatMessageArray = messageArray
			//通知页面滚动到底部了
			EventBus.$emit(EventView.newMessage);
		}
	},
})