
// 登录
export const login = (loginUserDto) => {
	return uni.$$post(`/user/login`, loginUserDto)
}
// 注册
export const register = (registerDto) => {
	return uni.$$post(`/user/register`, registerDto)
}

// 签到
export const sign = () => {
	return uni.$$post(`/user/sign`)
}
	
// 添加用户
export const addUser = (userAddRequest) => {
	return uni.$$post(`/user`, userAddRequest)
}
// 获取用户
export const getUser = (userQueryRequest) => {
	return uni.$$put(`/user/list/page`, userQueryRequest)
}

// 获取用户
export const updateUser = (UserUpdateRequest) => {
	return uni.$$put(`/user`, UserUpdateRequest)
}

	
// 删除用户
export const deleteUser = (uid) => {
	return uni.$$delete(`/user/${uid}`)
}

// 获取当前登录用户信息
export const currentUserInfo = () => {
	return uni.$$get(`/user/currentUserInfo`)
}
// 获取某用户信息
export const getUserInfoByUid = (uid) => {
	return uni.$$get(`/user/info/${uid}`)
}

// 激活他人账号
export const activeOther = (studentNo) => {
	return uni.$$post(`/user/active/other?studentNo=${studentNo}`)
}
// 通过积分激活
export const activeByCoin = () => {
	return uni.$$post(`/user/active/by/coin`)
}

