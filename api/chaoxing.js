
// 获取课程列表
export const courseLists = () => {
	return uni.$$request(`/chaoxing/course/list`,null,'GET',{
		'cx-cookie': uni.getStorageSync("cx-cookie") || ''
	})
}

// 登录
export const cxLogin = ({phone,password}) => {
	return uni.$$post(`/chaoxing/user/login`,{
		phone,password
	})
}
// 获取超星用户信息
export const cxUserInfo = () => {
	return uni.$$request(`/chaoxing/user/info`,null,'POST',{
		'cx-cookie': uni.getStorageSync("cx-cookie") || ''
	})
}

// 获取课程活动
export const courseActive = ({classId,courseId,fid}) => {
	return uni.$$request(`/chaoxing/active/list`,{
		classId,courseId,fid
	},'POST',{
		'cx-cookie': uni.getStorageSync("cx-cookie") || ''
	})
}

// 获取签到位置信息
export const locationInfo = (activeId) => {
	return uni.$$request(`/chaoxing/active/info/location/${activeId}`,null,'POST',{
		'cx-cookie': uni.getStorageSync("cx-cookie") || ''
	})
}

// 签到
export const sign = (body) => {
	return uni.$$request(`/chaoxing/sign`,body,'POST',{
		'cx-cookie': uni.getStorageSync("cx-cookie") || ''
	})
}



