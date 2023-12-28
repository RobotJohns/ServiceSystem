<template>
	<view class="content">
		<view class="content-box">
			<view v-for="item,index in fackUsers" :key="index">
				<view :class="[selectIndex == index?'fack-item-select':'fack-item']">
					<image :src="item.avatar" mode="aspectFit" @click="onSelect(index)"></image>
					<span>
						{{item.nickName}}
					</span>
				</view>
			</view>
		</view>
		<view class="content-unread" v-if="unReadCount">未读消息{{unReadCount}}</view>
		<button @click="onNext()">下一步</button>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				selectIndex: -1,
				unReadCount: 0,
				fackUsers: [{
					userID: '100001',
					nickName: '王小二',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_001.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJgg9dCXmjOkzGrpRjRZMcyyTfER6jyCwtKkPumOYejt9tJboUqPmBWWsYs7oqthCAE7ViS8tTFWKlLRfrDrU5gmR/qUBp+DXkpd8ND/z0LFMalW+iFxL5EqXAnz8VPbw2s=',
				}, {
					userID: '100002',
					nickName: '海底月捞不起',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_002.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJjtrNT4Er5WuPJcSbFggB9LYROEuEYMRO82vt6W7j7KAmZ2hK0dG1YUntuf/aU7K4rBufSj2FFWSRSmPHKf0gUv+UfAtOnCBA2c6nMkqYWiTxqAA5+t2iRG3Vz5eHIgse0Kxji/q+9QPnv3irFtHdmI'
				}, {
					userID: '100003',
					nickName: '谒词笙歌拟墨画扇',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_003.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJgZLKiIpfDdmZeuSu71iJcDKsd1QHMVdGtHpHE0HKUTz83/Ra5jcyBhAdmerzV5Xoo05rb1/YrAGwB7CPj2fihUKSv3lB/3dDCBobqoBwX0cC9zdNDas38GefL3C0m166/e0f5u5E+7KlFgqNSyOcvA'
				}, {
					userID: '100004',
					nickName: '巷子小仙女',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_004.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJjQufsU/7EfmKjMkYXa3WYqriyf7C2pkC9eCNWuNUBVJwk8RsUL/Rstj4m/ObQy+75Ss1LuedY7FGs/VaxC/PVhSG8UQUXj03/qR5+LslUTG80AxJp64VQGbDW0HaW01e0='
				}, {
					userID: '100005',
					nickName: '乐曲',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_005.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJhxxTZpYcG2PoXLxv+ofG2jPd+srE8JtjaJHsc0yndECSZesyiMzEgs7fRLEevH0eLbSrV6gImHul2XFA/3OlXlPaLfPky6z3GFOqyuvtS3kD02IyE6+7gGqQI7HWYlO5Y='
				}, {
					userID: '100006',
					nickName: '水乳交融',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_006.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJianmG+qM2mRbsCZH7zWnJZXMBIViJOINz3PPVdRnxkTP7px5YbJ7WA2H1vJok0j1SRVzlEtGZ4pfdyMCP+0hUuGbHTsTa5+8uCRiuqY5llVss24xo8ICe+pPda+GKsEeQ='
				}, {
					userID: '100007',
					nickName: '敷诋',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_007.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJhXdguGtm3ly6h/qlQmYfTXF6C51fW8NBzzhH53nONzfJSbr07loVyBC7bpj6JEoAaB48keCLgH7JuybG1qw1endIUR2Swtv535MEOj7+mdwap6f3fIVXi8xwoLDAbo4b4='
				}, {
					userID: '100008',
					nickName: '十六鹤井',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_008.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJhCuI3Rv7ZJiLwajSYnR9EWnqIHBCaOt5RQ6/wBo88GFvZi9iscV95kxpZusNrQFMI7d4UBxiR6KpqbNp1YM4K7IBmlm7r4oqImnY2HvffZLOy6pChJ7TkrgxY6yoWfkDs='
				}, {
					userID: '100009',
					nickName: '梦清云凉泽',
					avatar: 'http://172.61.10.9:9000/customerservice/common/avator_009.jpg',
					channel: 'pinchuang',
					authorization: 'WLLErhNdi3RoIstjS6DTSfftrY4+EieYXQtngPpcMJiD5kBBQUOqC7reQAEGakNjWDlB2Ds8NdyIJ/1I/5Dvnw6Yk6sL8iC8jYiPpviUEPhCDw3Y1cqfrlVYPWsHuGrKwbKRw2d2osxyeAPi3Xn0GlJMFfhLcT2v6NzGoSYiPIY='
				}]
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'userInfo',
			}),
		},
		methods: {
			async onSelect(index) {
				this.selectIndex = index
				this.$store.commit('updateUserInfo', this.fackUsers[this.selectIndex])
				const res = await this.$httpHelper.postRequestAuth('api/refreshNewMessage', {
					userID: this.fackUsers[this.selectIndex]['userID']
				})
				if (res.success) {
					this.unReadCount = res.content.unReadCount
				}
			},
			onNext() {
				if (this.selectIndex >= 0) {
					this.$store.commit('clearDatum', [])
					this.$store.commit('updateUserInfo', this.fackUsers[this.selectIndex])
					this.$store.commit('updateServiceInfo', {
						nickName: 'pinchuang客服',
						avatar: 'http://172.61.10.9:9000/customerservice/common/default_avatar.png'
					})
					uni.navigateTo({
						url: '/pages/conversation/conversation'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.content-box {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-around;

			.fack-item {
				padding: 30rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 200rpx;
				height: 120rpx;
				border: 2px #F8F8F8 solid;

				image {
					width: 80rpx;
					height: 80rpx;
				}

				span {
					text-align: center;
					font-size: 30rpx;
				}
			}

			.fack-item-select {
				padding: 30rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 200rpx;
				height: 120rpx;
				border: 2px blueviolet solid;
			}
		}

		.content-unread {
			color: blue;
			border: 1px red solid;
			border-radius: 10rpx;
		}

		button {
			width: 640rpx;
			height: 80rpx;
			margin-top: 40rpx;
			line-height: 80rpx;
		}
	}
</style>