import config from './config'
import store from '../store/index'

export default {
	async postRequest(url, datum, showLoading = false, showError = true) {
		return new Promise((resolve) => {
			this.onRequest(url, datum, {
				"content-type": "application/json;charset=utf-8",
			}).then((res) => {
				if (res.status == 200) {
					resolve({
						success: res.data.success,
						message: res.data.message,
						code: res.data.code,
						content: res.data.content,
					})
					if (!res.data.success && showError) {
						//Message.error(`访问出错了:${res.data.message}; code:${res.data.code}`)
					}
				} else {
					if (showError) {
						//Message.error(`访问出错了:${res.data.message}; code:${res.data.code}`)
					}
				}
			}).catch((error) => {
				resolve({
					success: false,
					message: error.message,
					code: error.code,
					content: null,
				})
				if (showError) {
					//Message.error(`访问出错了:${error.message}; code:${error.code}`)
				}
			});
		});
	},

	async postRequestAuth(url, datum = {}, showLoading = false, showError = true) {
		return new Promise((resolve) => {
			this.onRequest(url, Object.assign({
					userID: store.state.userInfo ? store.state.userInfo.userID : ''
				}, datum), {
					"content-type": "application/json;charset=utf-8",
					"authorization": store.state.userInfo ? store.state.userInfo.authorization : '',
				},
				showLoading,
				showError
			).then(async (res) => {
				if (res.success) {
					resolve({
						success: res.success,
						message: res.message,
						code: res.code,
						content: res.content,
					})
				} else {
					if (showError) {
						//Message.error(`访问出错了:${res.data.message}; code:${res.data.code}`)
					}
					if (res.code == 401) {
						//重定向到登录页面
						//await store.dispatch('core/cleanStorage');
					}
				}
			}).catch((error) => {
				resolve({
					success: false,
					message: error.message,
					code: error.code,
					content: null,
				})
				if (showError) {
					//Message.error(`访问出错了:${error.message}; code:${error.code}`)
				}
			});
		});
	},

	onRequest(url, datum, headers) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: `${config.hostHttp}/${url}`,
				data: datum,
				method: 'POST',
				header: headers,
				success: (res) => {
					if (res.statusCode == 200) {
						resolve(res.data)
					} else {
						reject(res)
					}
				},
				fail: (res) => {
					reject(datum);
				}
			});
		});
	}

}