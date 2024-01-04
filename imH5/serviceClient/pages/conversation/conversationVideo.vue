<template>
	<view class="chat-wrap">
		<view class="wrap-time" v-if="time">{{time}}</view>
		<view class="chat-video" :class="{ 'chat-self': !chatMessage.fromService }">
			<img class="char-avatar" :src="avatar" />
			<div class="video-box" @click="onPreview()">
				<img class="video-cover" :src="chatMessage.content.cover" fit="cover"></img>
				<img class="video-play" src="../../static/play.png" />
			</div>
		</view>
	</view>
</template>

<script>
	import {
		ViewMixin
	} from '../../components/viewMinix.js'
	export default {
		mixins: [ViewMixin],
		methods: {
			onPreview() {
				uni.navigateTo({
					url: `/pages/conversation/conversationPreviewVideo?cover=${encodeURIComponent(this.chatMessage.content.cover)}&src=${encodeURIComponent(this.chatMessage.content.src)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chat-wrap {
		margin: 20rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.wrap-time {
			font-size: 25rpx;
			color: #333;
			//  margin-top: 20rpx;
			// margin-bottom: 20rpx;
			margin: 20rpx 0;
		}

		.chat-video {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;

			.char-avatar {
				margin-left: 20rpx;
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.video-box {
				position: relative;

				.video-cover {
					margin-left: 20rpx;
					border-radius: 12rpx;
					min-width: 150rpx;
					min-height: 150rpx;
					max-width: 220rpx;
					max-height: 400rpx;
					object-fit: cover;
				}

				.video-play {
					position: absolute;
					width: 90rpx;
					height: 90rpx;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}

		.chat-self {
			flex-direction: row-reverse;
			.char-avatar {
				margin-right: 15px;
			}
		}
	}
</style>