const base = '/wejh'


// 学期信息
export const termInfo = () => {
	return uni.$$post(`${base}/terminfo`)
}

// 课程表
export const classTable = (body) => {
	return uni.$$request(`${base}/classtable`,body,'POST',{
		'wejh-cookie': uni.getStorageSync("wejh-cookie") || null
	})
}

// 考试安排
export const examArrange = (body) => {
	return uni.$$request(`${base}/exam/arrange`,body,'POST',{
		'wejh-cookie': uni.getStorageSync("wejh-cookie") || null
	})
}

// 成绩查询
export const examScore = (body) => {
	return uni.$$request(`${base}/exam/score`,body,'POST',{
		'wejh-cookie': uni.getStorageSync("wejh-cookie") || null
	})
}

// 登录
export const wejhLogin = (username,password) => {
	let body = {username,password}
	return uni.$$request(`${base}/login`,body,'POST',{
		'wejh-cookie': uni.getStorageSync("wejh-cookie") || null
	})
}




