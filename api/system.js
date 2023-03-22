// 圈子种类
const base = '/system'

// 修改轮播图列表
export const updateSwiper = (swiperList) => {
	return uni.$$put(`${base}/swiper`,swiperList)
}

// 获取轮播图列表
export const getSwiperList = () => {
	return uni.$$get(`${base}/swiper`)
}

// 修改热门活动列表
export const updateActivity = (activityList) => {
	return uni.$$put(`${base}/hotActivity`,activityList)
}

// 修改热门活动列表
export const getActivityList = () => {
	return uni.$$get(`${base}/hotActivity`)
}

// 更新应用
export const updateApp = () => {
	return uni.$$get(`${base}/updateApp`)
}

