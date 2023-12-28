import {
	io
} from 'socket.io-client';
let socket = null;
import config from '../utils/config'
import store from '../store/index'
import {
	EventEmit,
	EventOn,
} from './constEventSocket.js'
export default {
	doConnet() {
		if (socket != null && socket.isConnected) {
			console.error('current socket is connecting, pleace disconnect first!');
			return
		}
		socket = io(config.hostSocket, {
			transports: ['websocket'],
			auth: {
				"identification": 'client',
				"userID": store.state.userInfo.userID,
				"nickName": store.state.userInfo.nickName,
				"avatar": store.state.userInfo.avatar,
				"channel": store.state.userInfo.channel,
				"authorization": store.state.userInfo.authorization
				// "authorization": "Bearer " + store.state.core.token,
			},
		});

		socket.on('connect', () => {
			console.log('connect')
			if (!store.state.requesthistory) {
				socket.emit(EventEmit.chatClientHistory,
					store.state.userInfo.userID,
				)
				store.commit('requesthistoryState', true)
			}

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
	socketEntry() {
		return socket;
	},
	emit(key, value) {
		if (socket != null && socket.connected) {
			socket.emit(key, value);
		}
	},
	doDisConnect() {
		socket.disconnect()
	},
	regesterEvent() {
		socket.on(EventOn.chatMessage, (res) => {
			store.commit('updateChatMessageArray', [res])
		})
		socket.on(EventOn.serviceInfo, (res) => {
			store.commit('updateServiceInfo', res)
		})
		socket.on(EventOn.messageToClient, (res) => {
			store.commit('updateChatMessageArray', res)
		})
		socket.on(EventOn.messageToClientHistory, (res) => {
			store.commit('updateChatMessageArray', res)
		})
	}
}