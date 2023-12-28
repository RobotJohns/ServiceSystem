<template>
	<view class="conversation">
		<div class="conversation-content">
			<mescroll-uni ref="mescrollRef" bottom="120rpx" @init="mescrollInit" :down="downOption" :up="upOption"
				@down="downCallback">
				<view v-for="(item,index) in chatMessageArray" :key="index">
					<chat-notice :chatMessage='item' :index='index' v-if="item.msgType == messageNoticem"></chat-notice>
					<chat-robot :chatMessage='item' :index='index' v-if="item.msgType == messageRobot"></chat-robot>
					<chat-char :chatMessage='item' :index='index' v-if="item.msgType == messageCharacters"></chat-char>
					<chat-image :chatMessage='item' :index='index' v-else-if="item.msgType == messagePicture"></chat-image>
					<chat-video :chatMessage='item' :index='index' v-else-if="item.msgType == messageVideo"></chat-video>
				</view>
				<div class="content-bottom"></div>
			</mescroll-uni>
		</div>
		<div class="conversation-bottom">
			<div class="bottom-input">
				<textarea v-model="inputText" maxlength="150" placeholder="请输入内容" auto-height />
			</div>
			<div class="bottom-files" :class="[ inputText ? 'bottom-files-send':'']">
				<view class="button-send" @click="onSendText()" v-if="inputText">发送</view>
				<img v-else src="../../static/add.png" @click="onSendFile()" alt="">
			</div>
		</div>
	</view>
</template>

<script>
	//https://www.mescroll.com/uni.html
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import ChatNotice from './conversationNotice.vue'
	import ChatChar from './conversationChar.vue'
	import ChatImage from './conversationImage.vue'
	import ChatVideo from './conversationVideo.vue'
	import ChatRobot from './conversationRobot.vue'
	import socketHelper from '../../utils/socketIoHelper.js'
	import config from '../../utils/config.js'
	import {
		awaitMillisecond
	} from "../../utils/utilsTools";
	import {
		MessageType,
		EventEmit,
		EventView,
	} from '../../utils/constEventSocket.js'
	import {
		mapGetters
	} from 'vuex'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				inputText: '',
				superFile: ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'],
				downOption: {
					use: true,
					auto: false,
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					},
					use: true,
				},
				upOption: {
					use: false,
					auto: false,
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					},

				}
			}
		},
		components: {
			ChatNotice,
			ChatRobot,
			ChatChar,
			ChatImage,
			ChatVideo,
		},
		computed: {
			...mapGetters({
				userInfo: 'userInfo',
				chatMessageArray: 'chatMessageArray',
			}),
			messageNoticem() {
				return MessageType.noticeSystem;
			},
			messageRobot() {
				return MessageType.charactersRobot;
			},
			messageCharacters() {
				return MessageType.characters;
			},
			messagePicture() {
				return MessageType.picture;
			},
			messageVideo() {
				return MessageType.video;
			}
		},
		async mounted() {
			//console.log(this.userInfo)
			socketHelper.doConnet()
			this.$EventBus.$on(EventView.newMessage, (id) => {
				this.onScrollToBottom();
			});
		},
		methods: {
			mescrollInit(mescroll) {
				//关闭上拉
				mescroll.lockUpScroll(true)
			},
			downCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条

				this.mescroll.endByPage(10, 3);
				this.mescroll.resetUpScroll();
			},
			onSendText() {
				socketHelper.emit(EventEmit.chatMessage, {
					'msgType': MessageType.characters,
					'content': this.inputText
				})
				this.inputText = ''

			},
			onSendFile() {
				uni.chooseFile({
					count: 1, //默认100
					extension: ['.jpg', '.jpeg', '.png', '.mp4'],
					success: (res) => {
						if (res.tempFiles && res.tempFiles.length > 0) {
							const file = res.tempFiles[0];
							if (this.superFile.indexOf(file.type) > -1) {
								//console.log('file:', file)
								if (file.size / 1024 / 1024 < 10) {
									uni.uploadFile({
										url: `${config.hostHttp}/files/upload`, //仅为示例，非真实的接口地址
										filePath: file.path,
										name: 'file',
										success: (uploadFileRes) => {
											//console.log('uploadFileRes:', uploadFileRes);
											const res = JSON.parse(uploadFileRes.data)
											//console.log(res)
											if (res.success) {
												// socketHelper.emit(MessageType.)
												// > 2 说明是视频
												if (this.superFile.indexOf(file.type) > 2) {
													socketHelper.emit(EventEmit.chatMessage, {
														'msgType': MessageType.video,
														'content': res.content
													})
												} else {
													socketHelper.emit(EventEmit.chatMessage, {
														'msgType': MessageType.picture,
														'content': res.content
													})
												}
											} else {
												uni.showToast({
													icon: 'none',
													title: '发送失败' + res.message,
													duration: 2000
												});
											}

										},
										fail: (res) => {
											console.log(res)
											uni.showToast({
												title: '上传失败',
												duration: 2000
											});
										}
									});
								} else {
									uni.showModal({
										title: '提示',
										content: '上传文件不能超过 10M',
										showCancel: false,
									});
								}
							} else {
								uni.showModal({
									title: '提示',
									content: '你选择的文件格式不支持',
									showCancel: false,
								});
							}
						}
					}
				});
			},
			async onScrollToBottom() {
				// console.log('this.mescroll.getClientHeight():', this.mescroll.getBodyHeight())
				if (this.chatMessageArray.length > 8) {
					await awaitMillisecond(500);
					this.mescroll.scrollTo(999999000);
				}

				//this.mescroll.scrollTo(9999999);
			}
		},
		destroyed() {
			console.log('页面关闭')
			this.$EventBus.$off(EventView.newMessage)
			socketHelper.doDisConnect()
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.conversation {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;

		.conversation-content {
			width: 100%;
			display: flex;
			flex: 1;
			// height: 600px;
			background-color: #e5e5e5;
			font-size: 30rpx;

			.content-bottom {
				height: 40rpx;
			}

		}

		.conversation-bottom {
			z-index: 999;
			width: 100%;
			min-height: 120rpx;
			background-color: white;
			display: flex;
			flex-direction: row;
			align-items: center;
			border-top: 1px #eee solid;

			.bottom-input {
				margin: 10px 10px;
				flex: 1;
				max-height: 320px;

				textarea {
					width: 100%;
					min-height: 50rpx;
					max-height: 300px;
					padding: 5px;
					margin: 0;

					border: 1px #ddd solid;
					border-radius: 10rpx;
					overflow-y: scroll;
					// background-color: gold;
				}
			}

			.bottom-files {
				height: 100%;
				flex-shrink: 0;
				width: 120rpx;

				img {
					margin-left: 20rpx;
					margin-top: 20rpx;
					width: 80rpx;
					height: 80rpx;
				}
			}

			.bottom-files-send {
				width: 160rpx;

				.button-send {
					margin: 0 20rpx;
					margin-top: 23rpx;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					background-color: green;
					border-radius: 10rpx;
					color: white;
				}
			}
		}
	}
</style>