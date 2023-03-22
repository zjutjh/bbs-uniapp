// 圈子种类
const base = '/coinRecord'
// 拉黑用户
export const coinRecordPage = (pageRequest) => {
	return uni.$$post(`${base}/page`,pageRequest)
}




