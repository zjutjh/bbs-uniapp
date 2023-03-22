
// 获取验证码
export const captchaImage = () => {
	return uni.$$get(`/captchaImage`)
}