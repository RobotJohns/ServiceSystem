<template>
	<view class="chat-wrap">
		<view class="wrap-time" v-if="time">{{time}}</view>
		<view class="chat-char" :class="{'chat-self':!chatMessage.fromService }">
			<img :src="avatar" />
			<view class="char-content-warp">
				<view class="char-name" v-if='chatMessage.fromService'>{{ serviceInfo.nickName }}</view>
				<view class="char-content">{{ chatMessage.content }}</view>
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


		.chat-char {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;

			// background-color: brown;
			img {
				margin-left: 24rpx;
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

				.char-content {
					align-self: flex-start;
					padding: 12rpx 16rpx;
					background: white;
					border-radius: 10rpx;
					text-align: left;
				}
			}
		}

		.chat-self {
			flex-direction: row-reverse;
			img {
				margin-right: 30rpx;
			}
			.char-content-warp {
				.char-content {
					// text-align: right;
					background: #75df62;
				}
			}
		}
	}
</style>