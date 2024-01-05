<template>
	<view class="chat-wrap">
		<view class="wrap-time" v-if="time">{{time}}</view>
		<view class="chat-image" :class="{ 'chat-self': !chatMessage.fromService }">
			<img class="char-avatar" :src="avatar" />
			<view class="char-content-warp">
				<view class="char-name" v-if='chatMessage.fromService'>{{ serviceInfo.nickName }}</view>
				<img class="char-image" :src="chatMessage.content" @click="onPreview()" />
			</view>
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
				uni.previewImage({
					urls: [this.chatMessage.content]
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

		.chat-image {
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

			.char-content-warp {
				max-width: 60%;
				margin-left: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: start;

				.char-name {
					align-self: flex-start;
					font-size: 24rpx;
					border-radius: 5rpx;
					color: #222;
					// background-color: #ccc;
					padding: 3rpx 4rpx;
					margin-bottom: 10rpx;
				}

				.char-image {

					border-radius: 12rpx;
					min-width: 80rpx;
					min-height: 80rpx;
					max-width: 200rpx;
					max-height: 400rpx;
					object-fit: contain;
				}
			}
		}

		.chat-self {
			flex-direction: row-reverse;
			// margin-left: 100rpx;
			.char-avatar {
				margin-right: 30rpx;
			}
		}
	}
</style>