<template>
	<view class="chat-wrap">
		<view class="wrap-time" v-if="time">{{time}}</view>
		<view class="chat-image" :class="{ 'chat-self': !chatMessage.fromService }">
			<img class="char-avatar" :src="avatar" />
			<img class="char-image" :src="chatMessage.content" @click="onPreview()" />
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

			.char-image {
				margin-left: 20rpx;
				border-radius: 12rpx;
				min-width: 80rpx;
				min-height: 80rpx;
				max-width: 200rpx;
				max-height: 400rpx;
				object-fit: contain;
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