// 圈子种类
const base = '/circleCategory'

// 查询
export const getCircleCategoryList = (circleCategoryQueryRequest) => {
	return uni.$$post(`${base}/list`, circleCategoryQueryRequest)
}

// 添加圈子种类
export const addCircleCategory = (circleCategoryAddOrUpdateRequest) => {
	return uni.$$post(`${base}`, circleCategoryAddOrUpdateRequest)
}

// 更新圈子种类
export const updateCircleCategory = (circleCategoryAddOrUpdateRequest) => {
	return uni.$$put(`${base}`, circleCategoryAddOrUpdateRequest)
}

// 删除圈子种类
export const deleteCircleCategory = (id) => {
	return uni.$$delete(`${base}/${id}`)
}

// 获取某种类下的所有圈子
export const getCircleListByCategoryId = (categoryId) => {
	return uni.$$get(`${base}/of/${categoryId}`)
}
