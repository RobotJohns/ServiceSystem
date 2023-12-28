<template>
	<view class="preview-video">
		<video :src="url"></video>
		<img src="../../static/round_close.png" @click="onClose()" alt="">
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad: function(option) {
			if (option && option.url) {
				this.url = option.url
			} else {
				console.error('video url invalid')
				uni.navigateBack()
			}
		},
		methods: {
			onClose() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.preview-video {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #000;

		video {
			width: 100%;
			height: 100%;
		}

		img {
			z-index: 9999;
			top: 80rpx;
			right: 50rpx;
			position: absolute;
			width: 80rpx;
			height: 80rpx;
		}
	}
</style>