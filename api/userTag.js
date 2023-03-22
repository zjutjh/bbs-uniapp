// 用户标签
const base = '/userTag'

// 查询
export const getUserTagList = (userTagQueryRequest) => {
	return uni.$$post(`${base}/list`, userTagQueryRequest)
}

// 查询uid用户的tag列表
export const getUserTagListByUid = (uid) => {
	return uni.$$post(`${base}/list/${uid}`)
}

// 添加标签
export const addUserTag = (userTagAddRequest) => {
	return uni.$$post(`${base}`, userTagAddRequest)
}

// 更新标签
export const addUserTag = (userTagUpdateRequest) => {
	return uni.$$put(`${base}`, userTagUpdateRequest)
}

// 删除标签
export const addUserTag = () => {
	return uni.$$put(`${base}/${id}`)
}

