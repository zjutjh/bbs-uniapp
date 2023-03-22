

// 分页查询通知
export const notificationPage = (body) => {
	body.type = 0
	return uni.$$post(`/notification/list/page`,body)
	// {
	//   "pageNum": 0,
	//   "pageSize": 0,
	//   "receiveUserId": 0,
	//   "type": ""
	// }
}

// 分页查询互动通知
export const interactNotificationPage = (pageBody) => {
	return uni.$$post(`/notification/interact/list/page`,pageBody)
}

// 未读系统通知
export const systemNotificationItem = () => {
	return uni.$$post(`/notification/systemNotificationItem`)
}
// 未读互动通知
export const interactNotificationItem = (pageBody) => {
	return uni.$$post(`/notification/interactNotificationItem`,pageBody)
}

// 清空系统通知未读数
export const readAllOfSystem = () => {
	return uni.$$get(`/notification/readAll/system`)
}

// 清空互动通知未读数
export const readAllOfInteract = () => {
	return uni.$$get(`/notification/readAll/interact`)
}




	