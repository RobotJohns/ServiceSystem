<template>
	<div class="chat-wrap">
		<div class="wrap-time" v-if="time">{{ time }}</div>
		<div class="chat-message-char" :class="{ 'chat-self': chatMessage.fromService }">
			<img :src="avatar" />
			<div class="char-content">{{ chatMessage.content }}</div>
		</div>
	</div>
</template>
<script>
	import {
		ViewMixin
	} from "../../components/viewMinix.js";
	export default {
		mixins: [ViewMixin],
	};
</script>
<style lang="less" scoped>
	.chat-wrap {
		margin: 00px 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.wrap-time {
			font-size: 16px;
			color: #333;
			//  margin-top: 20rpx;
			// margin-bottom: 20rpx;
			margin: 20px 0;
		}

		.chat-message-char {
			margin-top: 20px;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;

			img {
				margin-left: 10px;
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}

			.char-content {
				margin-left: 10px;
				padding: 10px;
				background: white;
				border-radius: 6px;
				max-width: 60%;
				text-align: left;
			}
		}

		.chat-self {
			flex-direction: row-reverse;
			// margin-left: 50px;

			img {
				margin-right: 15px;
			}

			.char-content {
				// text-align: right;
				background: #75df62;
			}
		}
	}
</style>