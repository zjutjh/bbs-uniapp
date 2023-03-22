import config from '@/utils/config.js'

const $request = (url, data, method = 'POST', headers = "") => {
	let header = {
		'Content-Type': "application/json;",
		...headers,
	}
	let token = uni.getStorageSync("token")
	if (token) {
		header.token = token
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${config.domainNoLine}${url}`,
			method: method,
			data: data,
			header,
			success(res) {
				// 未登录
				if (res.data.code == 4001) {
					uni.showToast({title: '未登录',icon:"error"})
					uni.removeStorageSync('token')
					uni.navigateTo({url: '/pages/profile/login/login'})
				}
				else if (res.data.code >= 3000) {
					if (res.data.code == 4100) { //微精弘账号失效
						resolve(res.data)
						return uni.removeStorageSync('wejh-cookie')
					}
					else if (res.data.code == 4101) {//超星账号失效
						resolve(res.data)
						return uni.removeStorageSync('cx-cookie')
					}
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
					reject(res.data)
				}
				else {
					resolve(res.data)
					uni.hideLoading(); //关闭loading
				}
			},
			fail(error) {
				reject(error);
				console.log('网络连接失败',error);
				uni.showToast({title:'网络连接失败',icon:'error'})
				uni.hideLoading(); //关闭loading
			},
			complete() {
				uni.hideLoading(); //关闭loading
			},
			timeout: 30000
		})
	})
}
//get请求
const $get = (url, data) => {
	return $request(url, data, 'GET')
}
//post请求
const $post = (url, data) => {
	return $request(url, data, 'POST')
}
//delete请求
const $delete = (url, data) => {
	return $request(url, data, 'DELETE')
}
//delete请求
const $put = (url, data) => {
	return $request(url, data, 'PUT')
}
//给uniapp原生的requset赋值
//记得要在mian.js中引用
uni.$$request = $request
uni.$$get = $get
uni.$$post = $post
uni.$$delete = $delete
uni.$$put = $put

