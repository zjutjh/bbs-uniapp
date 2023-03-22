// 
const base = '/circle'

// 查询某个圈子
export const getCircleById = (circleId) => {
	return uni.$$get(`${base}/${circleId}`)
}
	
// 查询
export const getCircleList = (circleQueryRequest) => {
	return uni.$$post(`${base}/list`, circleQueryRequest)
}

// 添加圈子
export const addCircle = (circleAddOrUpdateRequest) => {
	return uni.$$post(`${base}`, circleAddOrUpdateRequest)
}

// 更新圈子
export const updateCircle = (circleAddOrUpdateRequest) => {
	return uni.$$put(`${base}`, circleAddOrUpdateRequest)
}

// 删除圈子
export const deleteCircle = (id) => {
	return uni.$$delete(`${base}/${id}`)
}

// 查询uid的加入的圈子列表
export const getJoinCircleListByUid = (uid) => {
	return uni.$$post(`${base}/joinList/${uid}`)
}

// 查询uid创建的圈子列表
export const getCreateCircleListByUid = (uid) => {
	return uni.$$post(`${base}/createList/${uid}`)
}	

// 加入圈子
export const joinCircle = (id) => {
	return uni.$$post(`${base}/join/${id}`)
}

// 退出圈子
export const leaveCircle = (id) => {
	return uni.$$post(`${base}/leave/${id}`)
}


