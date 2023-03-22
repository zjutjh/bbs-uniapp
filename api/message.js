// 
const base = '/message'

// 添加私信
export const sendMessage = (body) => {
	return uni.$$post(`${base}`,body)
	// {
	//   "content": "",
	//   "receiveUserId": 0,
	//   "type": "",// 0文字 1图片
	// }
}
export const messagePage = (body) => {
	return uni.$$post(`${base}/list/page`,body)
	// {
	//   "pageNum": 0,
	//   "pageSize": 0,
	//   "sendUserId": 0
	// }
}
// 查询聊天列表
export const ChatItemList = () => {
	return uni.$$post(`${base}/chatItem/list`)
}
// 全部设为已读
export const readAll = (userId) => {
	return uni.$$get(`${base}/readAll/${userId}`)
}

// 删除聊天列表
export const deleteChatItem = (userId) => {
	return uni.$$delete(`${base}/chatItem/${userId}`)
}


	