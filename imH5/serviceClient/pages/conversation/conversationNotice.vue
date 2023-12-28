<template>
	<view class="chat-notice">
		<div class="char-content">{{ chatMessage.content }}</div>
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
	.chat-notice {
		// margin: 20rpx 0;
		// height: 80rpx;
		margin-top: 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.char-content {
			max-width: 75%;
			font-size: 25rpx;
			color: #999;
			text-align: center;
		}
	}
</style>