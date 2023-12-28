<template>
	<view class="chat-wrap">
		<view class="wrap-time" >{{timeNow}}</view>
		<view class="chat-char">
			<img :src="chatMessage.content.avatar" />
			<div class="char-content">{{ chatMessage.content.message }}</div>
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
			margin: 20rpx 0;
		}

		.chat-char {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;

			img {
				margin-left: 24rpx;
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.char-content {
				margin-left: 20rpx;
				padding: 20rpx;
				background: white;
				border-radius: 10rpx;
				max-width: 60%;
				text-align: left;
			}
		}
	}
</style>