import {
	mapGetters
} from 'vuex'
export const ViewMixin = {
	computed: {
		...mapGetters({
			userInfo: 'userInfo',
			serviceInfo: 'serviceInfo',
			chatMessageArray: 'chatMessageArray',
		}),
		avatar() {
			if (this.chatMessage.fromService) {
				return this.serviceInfo.avatar;
			} else {
				return this.userInfo.avatar;
			}
		},
		time() {
			if (this.index == 0) {
				return this.$moment(this.chatMessage.time).format('LLL');
			} else {
				const timeBefore = this.chatMessageArray[this.index - 1].time;
				///五分钟以内不展示时间
				if (this.chatMessage.time - timeBefore < 5 * 60 * 1000) {
					return '';
				}
				///1个小时以内展示时间
				if (this.chatMessage.time - this.$moment().valueOf() < 60 * 60 * 1000) {
					return this.$moment(this.chatMessage.time).format('LT');
				}
				return this.$moment(this.chatMessage.time).format('LTS');
			}
		},
		timeNow() {
			return this.$moment(this.chatMessage.time).format('LLL');
		}
	},
	props: {
		chatMessage: {
			type: Object,
			required: true,
			default: () => {
				return {
					msgType: 0,
					content: "",
					time: 0,
					fromService: false,
				};
			},
		},
		index: {
			type: Number,
			required: true,
			default: 0,
		}
	}
}