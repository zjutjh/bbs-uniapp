// 用户标签
const base = '/follow'

// 关注列表
export const getFollowPage = (uid,pageBody) => {
	return uni.$$post(`${base}/page/${uid}`,pageBody)
}

// 粉丝列表
export const getFanPage = (uid,pageBody) => {
	return uni.$$post(`${base}/fan/page/${uid}`,pageBody)
}

// 关注or取消关注(返回-1取消关注成功 1关注成功 0异常）
export const toggleFollow = (targetId) => {
	return uni.$$put(`${base}/${targetId}`)
}

// 与某用户的共同关注
export const getJoinFollowSimple = (targetId) => {
	return uni.$$post(`${base}/joinFollow/${targetId}`)
}
