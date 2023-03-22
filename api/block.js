// 圈子种类
const base = '/block'
// 拉黑用户
export const addBlock = (targetUserId) => {
	return uni.$$put(`${base}/${targetUserId}`)
}
// 取消拉黑用户
export const deleteBlock = (targetUserId) => {
	return uni.$$delete(`${base}/${targetUserId}`)
}
// 判断是否被拉黑
export const isBlocked = (targetUserId) => {
	return uni.$$post(`${base}/isBlocked/${targetUserId}`)
}



